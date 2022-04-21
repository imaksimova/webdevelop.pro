---
title: "Login via browser's cookies (Selenium WebDriver) or Local Storage (JavaScript)"
subTitle: How to avoid repeating login action before running each test?
description: >
  How to avoid repeating login action before running each test? It depends on how this was implemented in your Web application (via cookies or Local Storage).
date: 2018-06-05
draft: false
authors: "Ratmir Asanov"
image: /images/blog/30.png
tags: [
  "Json",
  "Login Action",
  "Cookies",
  "Local Storage"
]
---

It depends on how this was implemented in your Web application (via cookies or Local Storage).

So, let's start with cookies. The following algorithm should be used in this case (with the help of Selenium WebDriver):

1. Login by usual (via email and password);
2. Save cookies of your current session;
3. Open the site and load saved cookies.

After step 3 you will log in to the application as the same after step 1. Now I will demonstrate this with the following code snippets:

```
"""Module Utilities with different useful methods."""

...
import pickle
import json
...


class Utilities:
    """Class Utilities with different useful methods."""

    ...

    def save_cookie(self, name):
        """A method for saving cookies for domain."""

        with open(name + ".pkl", "wb") as filehandler:

            pickle.dump(self.driver.get_cookies(), filehandler)

        def load_cookie(self, name):
        """A method for loading cookies for domain."""

        with open(name + ".pkl", "rb") as cookiesfile:

            cookies = pickle.load(cookiesfile)

            for cookie in cookies:

                if isinstance(cookie.get("expiry"), float):

                    cookie["expiry"] = int(cookie["expiry"])

                self.driver.add_cookie(cookie)
```

Note that you can save and load cookies only for the current domain.

What if is your Web application using Local Storage? In this case, you can use the following method in Utilities class:

```
def set_local_storage(self, key, value):
    """A method for setting key in local storage."""

    self.driver.execute_script("window.localStorage.setItem('{}',{})".format(key, json.dumps(value)))
```

Using this method you can set up all needed pairs of key/value in Local Storage. Then you will see that you are logged in (after updating the page).

Now let's consider a more practical example -- login to Facebook via pre-saved cookies of user. First of all, we need to log in by usual and save cookies of the user:

```
"""Module for saving cookies for the domain."""

import time

import config
from utilities import Utilities


class GetCookies(Utilities):
    """Class for saving cookies for the domain."""

    def __init__(self, email="", password=""):
        """Method for saving cookies for the domain."""

        config.DOMAIN = "https://facebook.com"
        self._set_up()
        # Finding elements on the page and actions.
        self.wait_visibility_by_id("email").send_keys(email)
        self.find_by_id("pass").send_keys(password)
        self.find_by_id("loginbutton").click()
        # Saving user's cookies.
        self.save_cookie("ratmir.asanov.demo")
        time.sleep(config.DELAY2)
        self._tear_down()


if __name__ == "__main__":
    COOKIE = GetCookies(config.USER1["email"], config.USER1["password"])
```

Then we need to log in with using pre-saved user's cookies:

```
"""Module for loading cookies for the domain."""

import time

import config
from utilities import Utilities


class LoadCookies(Utilities):
    """Class for loading cookies for the domain."""

    def __init__(self, name_of_cookies_file):
        """Method for loading cookies for the domain."""

        config.DOMAIN = "https://www.facebook.com"
        self._set_up()
        # Loading user's pre-saved cookies.
        self.load_cookie(name_of_cookies_file)
        # Refresh the page to see the changes (user should be logged in).
        self.refresh_page()
        time.sleep(config.DELAY2 * 5)
        self._tear_down()


if __name__ == "__main__":
    COOKIE = LoadCookies("ratmir.asanov.demo")
```

Hope it helps you!

Click [here](https://github.com/ratmirasanov/demo_test_automation_project) for source code.

Used references:

- [pickle](https://docs.python.org/3/library/pickle.html).
- [json](https://docs.python.org/3/library/json.html).
- [Selenium with Python](https://selenium-python.readthedocs.io/).
