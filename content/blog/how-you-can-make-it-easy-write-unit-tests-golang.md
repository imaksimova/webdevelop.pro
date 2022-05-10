---
title: "How You Can Make It Easy To Write Unit-Tests In Golang"
description: When I started to write unit-tests in golang at first it wasn't easy and it was taking much time. I didn't know specific tools, technique and libraries to make easy writing of tests.
date: 2020-04-06
draft: false
authors: "Artem Tiumentcev"
image: /images/blog/17.jpg
tags: [
  "Golang",
  "Unit-tests"
]
---

When I started to write unit-tests in golang at first it wasn't easy and it was taking much time. I didn't know specific tools, technique and libraries to make easy writing of tests. Mocking interfaces was scary and caused a lot of confusion as the implemented interfaces were turned into a sprawling tree of ifs. All this led to such tests becoming difficult to maintain.
Over time, I found a package [testify](https://github.com/stretchr/testify) of tools that make easy the writing of tests and also GoLand (IDE to golang) which allow you generate interface implementation.
Let me show you example of that. Let's say we need to get the user data, we have the API client for that. We need to make for this client an interface and data structure and a simple function that helps us get a user.

```
type User struct {
  ID    string
  Email string
}

type SomeAPIClient interface {
  GetUser(usedId string) (*User, error)
}

func getUser(c SomeAPIClient, userID string) (*User, error) {
  return c.GetUser(userID)
}
```

Now this functionality can be covered with tests. First we implement our client.

```
type FakeClient struct {
  mock.Mock
}
```

As you can see, I have added mock.Mock to the structure so that I can mock methods when writing tests.

Now we need to implement interface GetUser we can do it via GoLand using shortkey Ctrl+I or write this

![](/images/blog/post-img-6.png)

```
func (f FakeClient) GetUser(usedId string) (*User, error) {
  panic("implement me")
}
```

It is still raw and we need to supplement it so that our function can call this method.

```
func (f FakeClient) GetUser(usedId string) (*User, error) {
  args := f.Called(usedId)
  if args.Get(0) == nil {
    return nil, args.Error(1)
  }
  return args.Get(0).(*User), args.Error(1)
}
```

This implementation calls the necessary mock object, checks if it is empty, if everything is ok, then returns it.

Now let's just write our unit test.

```
func TestClient(t *testing.T) {

  assert := assert.New(t)
  testClient := new(FakeClient)

  testClient.On("GetUser", "error").Return(nil, errors.New("error"))
  u, err := getUser(testClient, "error")

  assert.Nil(u)
  assert.EqualError(err, "error")
  testClient.AssertExpectations(t)

}
```

What do we do here? We create a new client of API, then mock our method and in the end we check to see if everything worked out correctly.

```
Test run show us

=== RUN   TestClient
TestClient: user_test.go:32: PASS: GetUser(string)
--- PASS: TestClient (0.00s)
PASS
```

Add a couple more lines to our test to check we get a user

```
testUser := &User{ID: "user"}
testClient.On("GetUser", "user").Return(testUser, nil)

u, err = getUser(testClient, "user")

assert.Equal(testUser, u)
assert.Nil(err)
```

You can look at the example code [here](https://gist.github.com/darland/a085cbf797bbd26e00f1d4949d3ac02a)