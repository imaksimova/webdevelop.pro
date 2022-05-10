---
title: "The tiny framework based on AIOHTTP"
subTitle: Build your APIs easily
description: Let me introduce our project, I think he's already moved on to a 
  stage when it can be called a framework. Although its name says that it is boilerplate
date: 2020-02-27
draft: false
authors: "Artem Tiumentcev"
image: /images/blog/21.jpg
tags: [
  "Python 3",
  "AioHTTP",
  "Python"
]
---

Let me introduce our project, I think he's already moved on to a stage when it can be called a framework. Although its name says that it is boilerplate (maybe in the future, we will change the name). The project is still quite raw, but you can easily build your APIs.

So let's try to show everything by example and build a minimal application that will give the list of posts.

First, let's create a folder where be our project and then set up a virtual environment and install our framework

```
mkdir example
cd example
python -m venv venv
source venv/bin/activate
pip install aiohttp_boilerplate
```

Let's create a folder for organizing project files

```
mkdir app
```

Then we begin to describe the data model from which validate, deserialize and serialize. For that we use [marshmallow](https://marshmallow.readthedocs.io/en/stable/).

Create a file `schemas.py`

```
from marshmallow import Schema, fields

class PostSchema(Schema):
  id = fields.Int()
  name = fields.Str()
  content = fields.Str()
```

Create a file `models.py` where will be a class which helps us communicate with a database without writing any SQL queries

```
from aiohttp_boilerplate.models import Manager

class Page(Manager):
  table = "post_post"
```

This set will be enough to create an endpoint through which we can get posts

Create a file `views.py`

```
from aiohttp_boilerplate.views.list import ListView

from .models import Post
from .schemas import PostSchema


class PostListView(ListView):
    def get_model(self):
          return Post

    def get_schema(self):
        return PostSchema
```

We also need to specify the path the class to handle a request

Create a file `routes.py`

```
from . import views

def setup_routes(app):
    app.router.add_route("GET", "/", views.PostListView)
```

Then we create a file '**main**.py' to run the service

```
from aiohttp_boilerplate.bootstrap import web_app

if __name__ == “__main__”:
    web_app()
```

Since this service communicates with the database, we need to add variables to the environment to connect to the database.

```
export DB_DATABASE=test
export DB_USER=postgres
export DB_PASSWORD=password
export DB_HOST=localhost
export DB_PORT=5432
```

If you don't have your own database running, you can run a test database into a docker container.

```
docker run --rm --name test-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=test -p 5432:5432 -d postgres
```

Attach to the database concole

```
docker exec -it some-postgres psql -Upostgres
```

Create a table

```
create table post_post
(
    id serial
        constraint post_post_pk
        primary key,
    name varchar(50) default '' not null,
    content text default '' not null
);
```

Fill it with data

```
insert into post_post (name,content) values ('Post 1', 'Content');
insert into post_post (name,content) values ('Post 2', 'Blabla');
```

All files are ready to launch our service. The structure of the project looks like this.


```
├── app
│   ├── __init__.py
│   ├── __main__.py
│   ├── models.py
│   ├── routes.py
│   ├── schemas.py
│   └── views.py
└──
```

Run the application

```
python -m app 
```

Make a request

```
➜ http get http://localhost:8080/

{
    "count": 2,
    "data": [
        {
            "content": "Content",
            "id": 1,
            "name": "Post 1"
        },
        {
            "content": "Blabla",
            "id": 2,
            "name": "Post 2"
        }
    ]
}
```

The source code of this example you can find [here](https://github.com/webdeveloppro/aiohttp_boilerplate/tree/master/examples/simple_app)