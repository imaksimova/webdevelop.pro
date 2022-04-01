---
title: "Rejection Of The Dependency Manager Pipenv"
subTitle: The main advantages of pipenv
description: When the dependency manager pipenv became popular and its 
  included in PyPA GitHub organization. We had been starting to use pipenv 
  in our projects both in development and in a deploymen
date: 2020-01-22
draft: false
authors: "Artem Tiumentcev"
image: /images/blog/23.jpg
tags: [
  "Python 3",
  "Virtualenv",
  "Pipenv"
]
---

When the dependency manager [pipenv](https://github.com/pypa/pipenv) became popular and its included in PyPA GitHub organization. We had been starting to use pipenv in our projects both in development and in a deploymen.

The main advantages of pipenv, which we have highlighted for ourselves.

- The easiest way to add new dependencies into a project. You don’t need to add it manually into requirements.txt or run a command `pip freeze > requirements.txt` prior to each commit.
- There is no need to manually track the versions of dependencies if without pinning them.
- Pipenv takes over the deployment of the virtual environment for each project.

During development, you can set up a virtual environment and run three simple commands

```
pipenv --python python3.7
pipenv install
pipenv shell
```

When building a docker image

```
RUN pip install pipenv
RUN pipenv install --system --deploy
```

While working with pipenv in several of our projects we noticed some shortcomings

- It was necessary to train some of the developers to use the new tool because they haven’t used pipenv yet and they are used to working with pip tools and with requirement files which has often led to different problems.
- Supporting dependency was more time-consuming then it seemed From the very beginning If don’t pin a version it can be hell because pipenv always trying to update old dependency and always reminding about it and doesn’t do anything until you updating it or pinning.
- Application build time increased

We came to the conclusion that while pipenv is installing packages there's a lot of dependency checks going on and comparing them with an existing lock file. Also, if a lock file doesn’t exist that needs additional time to create it. All of this increases time of building in two or three times.

Here are a few issues where it was discussed:

- [https://github.com/pypa/pipenv/issues/3827](https://github.com/pypa/pipenv/issues/3827)
- [https://github.com/pypa/pipenv/issues/1914](https://github.com/pypa/pipenv/issues/1914)

After several experiments with the dependency manager, we decided that it was not suitable for our projects as it increases the delivery time of applications and we returned to the usual method of installing dependencies via pip-tools in a building process.

But some of teammates are still using pipenv to setup a virtual environment on local machine.

It's very easy to do.

```
pipenv --python python3.7
pipenv shell
pip install -r requirements.txt
```

There is a time-tested virtualenv that is also easy to do

```
virtualenv -p python3 env
source env/bin/activate
pip install -r requirements.txt
```

Pipenv has had a good attempt to become a general manager of dependencies in the python environment, but it has certain shortcomings that will not completely replace the standard pip-tools.