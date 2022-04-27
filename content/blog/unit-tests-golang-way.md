---
title: "Unit Tests in Golang Way"
subTitle: My story with unit tests in Golang way.
description: >
  I’ve been working more than 7 years with Python. The way I tested applications with Python was really different from Golang. At first, Golang might shock you, but you just need to understand the ideas behind “Go”.
date: 2018-02-13
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/35.png
tags: [
  "Golang",
  "Python",
  "Tests",
  "Unit-tests",
  "Mock"
]
---

Hello everyone.

Today, I want to talk about unit tests in Golang. I’ve been working more than 7 years with Python. The way I tested applications with Python was really different from Golang. At first, Golang might shock you, but you just need to understand the ideas behind “Go”. Using Go is really different from using scripting languages, such as Python, PHP, JavaScript, Ruby, etc. I would like to share my understanding, and I really hope to help you adjust to Golang.

Let's start with a small example. If you worked with Django/Python you would see code like this:

```
from django.test import Client
c = Client()
User.object.create({‘username’: ‘john’, ‘password’: ‘smith’})
response = c.post('/login/', {'username': 'john', 'password': 'smith'})
self.assert(response.status_code, 200)
```

Are you trying to do the same thing on Golang? Well, doing this properly on “Go” is different. Probably, you already searched how to mock databases or Redis in Go, how to mock functions, and load fixtures, but you did not find anything that works for you, and maybe even decided to write down your own solution.

#### Hey, stop for a minute!

![post image](/images/blog/post-img-7.jpg)

Real "Gophers" are trying to stay minimalistic and keep simplicity everywhere. Go does not provide you a way to mock functions out of the box and it does not have all whistles build-in as scripting languages. And it is maybe sound absurd but it is a strong side of the development process with Golang .

You actually don't need it. Cause main idea of the unit tests is:

- First, test only code you create;
- Second, make it quick and effective so you can run it after each saving.

Yes, building integration tests on already existing codebase is a good way to check your code on architecture flaws. But, its a different problem and its always better to maintain small sets of tests from the beginning rather then prospone tests creation for a better day.

Let’s come back to the mocking problem. Here is a thing - you actually don’t need to mock database, you don’t need to mock facebook API call or any other third part software you are using. First, you need to focus on the stuff you have build and only after worry about integration problem.

Stay focus on your code:

![post image](/images/blog/post-img-8.jpg)

As a side effects of unit tests, you might need to refactor your existing method and functions in order to be able to test it. And its an indicator you are on the right track. Step by step your functions will become more clear, smaller and more robust. My takeaway with Golang was that I need to think in a conception of steaming data. A database or a file, memory read and write operations is basically coping bytes from one source to another. Thats why its convinient to operate on a bytes level. Its more easy to transfer data in bytes from one shape to another. But, anyway, instead of making real database requests, all you need to do is to make sure your application logic is correct and by passing correct data you are receive correct results.

I would like to take a small example of a login function:

```
// New will create new App instance and setup storage connection 
func New(host, user, password, dbname string) (a App, err error) { 
   a = App{} 

   if host == "" { 
     log.Fatal("Empty host string, setup DB_HOST env") 
     host = "localhost" 
   } 

   if user == "" { 
     return a, fmt.Errorf("Empty user string, setup DB_USER env") 
   } 

   if dbname == "" { 
     return a, fmt.Errorf("Empty dbname string, setup DB_DBNAME env") 
   } 

   connectionString := 
     fmt.Sprintf("host=%s user=%s password='%s' dbname=%s sslmode=dis 

   a.DB, err = sql.Open("postgres", connectionString) 
   if err != nil { 
     return a, fmt.Errorf("Cannot open postgresql connection: %v", err) 
   } 

   a.Router = mux.NewRouter() 
   a.initializeRoutes() 
   return a, nil 
} 

func (a *App) login(w http.ResponseWriter, r *http.Request) { 
   var u User 
   decoder := json.NewDecoder(r.Body) 
   err := decoder.Decode(&u) 

   errors := checkLoginData(&u) 

   if len(errors) > 0 { 
     respondWithJSON(w, r, http.StatusBadRequest, errors) 
     return    } 

   if err := a.DB.QueryRow(“”); err != nil { 
     errors["__error__"] = append(errors["__error__"], "email or password 
   } 

   if len(errors) > 0 { 
     respondWithJSON(w, r, http.StatusBadRequest, errors) 
     return
   } 

   respondWithJSON(w, r, 200, u) 
}
```

I can see a few problems here:

- The app created DB connection in New method;
- SQL query in login function force us to use database.

In order to run a test, we would need:

- Setup the test database, get it up and ready to accept connections;
- Upload fixtures and test data;
- Run test server;
- Initialize full application;
- Test your code;
- Read and write data to database;
- Close application;
- Clear database.

All of this operations is time-consuming. And you would need to fake 80% of this to create a test environment for yourself. Considering how much of developers time wasted maintaining and running unit tests, it may become an undesirable task and manual testing seems like a less expensive solution.

As as solution, its possible to add a function likeUser.get and mock that function, but we can find more elegant solution.
Golang provides us simple, until powerful, solution for all these problems. From all list above we only need to left one item: test your code.

So how do we do this? Stop thinking about what you should save to the database. All we did here is just transform data from one form to other. An interface with concrete functions and without hard dependency on third part software thats all we need:

```
// Storage provider can handle read/write for our application 
type Storage interface { 
   GetUserByEmail(*User) error 
   CreateUser(*User) error 
}
```

In addition we will need structures for live application and for test one:

```
// PGStorage provider can handle read/write from database 
type PGStorage struct { 
   con *sql.DB 
} 

type FakeStorage struct { 
   data User 
   resp string 
   code int 
}
```

With a stuctures we made assumption that our database is working fine so all we need to do is to fake SQL requests/responses. Even more, we can just use a table tests with assumption what data correct and vice versa.

Again, that might not have a sense for a first sight but if you look closer, you might see that you did the same before on Python/PHP/Ruby/JavaScript with:

```
User.create({‘username’: ‘john’, ‘password’: ‘smith’})
```

I.e. create data functions is "equal" to Golang table test data

```
FakeStorage{ 
   data: User{ 
     Email: "new@user.com", 
     Password: "123123" 
   }, 
   resp: `{"id":1}`, 
   code: 201 
},
```

Python code might give you more mental confidence but the price of that confidence is too high. More important, when you spent too much time on unit tests you may not have enough time on integration tests which can bring a great help to find issues and bugs in production.

So don't try to reinvent the wheel, don't test piece of the application that already been tested by other developers — try to test your code, don't spend too much time on getting 100% coverage. Leave time and energy for integration tests you will need them anyway.

For the folks who think integration tests is hard, it is not. To test real SQL queries I just did (I assume you have HTTPie if not you can use curl):

```
#/bin/bash 

psql -Upostgres test_user < sql/01_user.sql 
http http://127.0.0.1:8000/signup <<< '{"email": "test@gmail.com", "pass 
sleep 1 
http http://127.0.0.1:8000/login <<< '{"email": "test@gmail.com", "passw 
```

I'll get all errors during real SQL queries using this 4 lines script.

It took 3 seconds to execute, and it covered pieces of codebase which we havent test with unit tests.