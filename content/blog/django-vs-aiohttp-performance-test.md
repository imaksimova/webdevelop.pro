---
title: "Django vs. Aiohttp Performance Test"
subTitle: Two popular frameworks comparison.
description: >
  Today I would like to take a trendy Python framework Django and compare it with a brand new framework aiohttp.  I'm a Django fan and believe that Django is a really good framework, and I recommend to use it.
date: 2017-12-13
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/36.png
tags: [
  "Сomparison",
  "AioHTTP",
  "Django",
  "Python",
  "Async"
]
---

Hello everyone.

I want to continue the discussion about sync vs. async function calls.

Today I would like to take a trendy Python framework **Django** and compare it with a brand new framework **aiohttp**.

I'm a Django fan and believe that Django is a really good framework, and I recommend to use it. But if you have a lot of network or input/output operations and you want to speed up your application, try to use the new Python async library with aiohttp framework. In my case, we got the tremendous speed up the boost and that's why I've decided to create this article.

Let's move on to our topic and let's try to test with the real environment, where we have:

- Python program runs in Docker;
- Python program makes SQL select query to PostgreSQL database, which also runs in other Docker container;
- Python program makes a query to Redis and increases the counter by one; Redis is working in another Docker container.

For Django, I will use an existing solution --> [https://github.com/realpython/dockerizing-django](https://github.com/realpython/dockerizing-django), and here is a full 
article [https://realpython.com/blog/python/django-development-with-docker-compose-and-machine/](https://realpython.com/blog/python/django-development-with-docker-compose-and-machine/).

To make the comparison fair, I will change Postgres run command for docker-compose.yml from the article below to:

```
postgres:
  restart: always
  image: postgres:9.6
  ports:
    - "5432:5432"
  volumes:
    - pgdata:/var/lib/postgresql/data/
  command: postgres -c max_connections=500 
```

I will try to recreate same code using asyncio, aiohttp, aioredis and asyncpg.

Let's take a look at our view file:

- To show todo page, we will grab all data from the database;
- Read Redis counter and increase its amount;
- Render template with Jinja engine;
- Send a response to the browser.

```
class ListView(web.View):
    async def get(self):
        query = "SELECT * FROM item"
        todo_list = []
        data = await self.request.app.db.fetch(query) for record in data:
            todo_list.append(dict(record))
            counter = await self.request.app.redis.incr('counter')
        context = { 'items': todo_list, 'counter': counter }
        response = aiohttp_jinja2.render_template( 'home.html', self.request, context )
        return response
```

Create function will look more complicated, but still it simple enough:

- Parse HTTP request and check if its valid JSON and post data is not empty;
- Clear data and check if we have all required fields;
- Insert cleared data into the database table.

```
class CreateView(web.View):
    schema = ItemSchema

    async def perform_create(self, params):
        query = 'insert into {}({}) values({}) RETURNING id'.format( 'item', ','.join(params.keys()), ','.join(['$%d' % (x+1) for x in range(0, params.__len__())]), )
        result = await self.request.app.db.fetchval(query, *params.values())
        return result

    async def get_schema_data(self, schema=None):
        data = await self.request.json()
        if not data:
            raise web.HTTPBadRequest( text='Empty data', content_type='application/json')
        try:
            schema_result = self.schema().load(data)
        except Exception as e:
            raise web.HTTPBadRequest( text=traceback.format_exc(3, 100), content_type='application/json')

        if schema_result.errors:
            raise web.HTTPBadRequest( text="{}, data: {}".format( json.dumps(schema_result.errors), data ), content_type='application/json' )
        return schema_result

    async def post(self):
        # data schema checking
        schema_result = await self.get_schema_data()
        if schema_result.data.keys().__len__() == 0:
            return web.json_response({'status': 204, 'error': 'No content'}, status=204)

        try:
            await self.perform_create(schema_result.data)
        except Exception as e:
            return web.json_response(e, status=500)
        return web.json_response(text="{}", status=201)
```

Full code and Docker containers you can find here .

1. I will use work for tests on my MacBook Pro early 2015 (Intel 2.7 Core i5, 8 GB DDR3, and SSD).
2. I will make run each test 5 times and show average results.

Detail results for each run you can find here .

**The first test, we will run 500 connections with ten threads, let's start from Django:**

```
$ wrk -c 500 -t 10 http://192.168.99.100/ average results: Average results of Running 10s test @ http://192.168.99.100/ 1049 requests in 10.08s Socket errors: connect 257, read 0, write 0, timeout 116 Requests/sec: 104
```

**Same test for aiohttp:**

```
$ wrk -c 500 -t 10 http://192.168.99.100/ avarange results: Average results of Running 10s test @ http://192.168.99.100/ 5904 requests in 10.08s Socket errors: connect 257, read 0, write 0, timeout 0 Requests/sec: 585.41
```

![post image](/images/blog/post-img-45.png)

**To be sure I will run the second test with different parameters, same code but let's give more traffic on our Django servers:**

```
$ wrk -c 1500 -t 10 -d 60s --timeout 5s http://192.168.99.100/ Average Running 1m test @ http://192.168.99.100/ 6128 requests in 1.00m, 9.41MB read Socket errors: connect 1257, read 0, write 0, timeout 88 Non-2xx or 3xx responses: 5 Requests/sec: 101.99
```

**And ioahttp:**

```
$ wrk -c 1500 -t 10 -d 60s --timeout 5s http://192.168.99.100/ Average Running 1m test @ http://192.168.99.100/ 36563 requests in 1.00m, 63.11MB read Socket errors: connect 1257, read 0, write 0, timeout 0 Requests/sec: 608.45
```

![post image](/images/blog/post-img-46.png)

## Results

```
Connections Library Requests Timeouts Req/sec 500
Django 1049 116 104 500
Aiohttp 5904 0 585 1500
Django 6128 88 101 1500
Aiohttp 36563 0 608
```

As you can see, general Django solution about six times slower than aiohttp library.

I think for a people who did not use asynchronous calls it would be hard to believe in such a big difference, but that tests are real, take a look by yourself!

You are welcome to comment and ask questions or give any suggestions for both Django or aiohttp.