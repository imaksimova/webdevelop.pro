---
title: "Page Object Pattern in automated testing with Selenium WebDriver"
subTitle: Test automation with Selenium WebDriver and Page Object Pattern.
description: >
  Today I want to talk about Page Object Pattern which very popular in test automation with Selenium WebDriver. In my post will be used Python binding for Selenium WebDriver and Google Chrome Driver.
date: 2018-01-12
draft: false
authors: "Ratmir Asanov"
image: /images/blog/29.jpg
tags: [
  "WebDriver",
  "PageObject",
  "Python"
]
---

Today I want to talk about Page Object Pattern which very popular in test automation with Selenium WebDriver. In my post will be used Python binding for Selenium WebDriver and Google ChromeDriver.

There are several advantages of using Page Object Pattern:

1. Reduces the duplication of code: combine all actions to work with a web page in one place;
2. Makes tests more readable and robust: separation of test code and description of pages;
3. Improves the maintainability of tests, particularly when there are frequent changes on the pages.

For example, take a look at how it works with login action on YouTube. Create a class with a description of this page using the Page Object Pattern:

```
"""Module MainPage for mapping the main page of Youtube."""

from selenium.webdriver.support import ui
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from page_objects import PageObject, PageElement
import config
from utilities import Utilities


class MainPage(PageObject, Utilities):
    """Class MainPage for mapping the main page of Youtube."""

    # Mapping web elements on the page.
    login_button = PageElement(css="#buttons a > .style-scope.ytd-button-renderer"
                                   ".style-suggestive.size-small[role='button']")

    def goto_login_page(self):
        """A method for opening the login page on the Youtube."""

        self.wait_clickable_by_css("#buttons a > .style-scope.ytd-button-renderer"
                                   ".style-suggestive.size-small[role='button']")
        self.login_button.click()

    def wait_clickable_by_css(self, css_selector, timeout=config.DELAY1):
        """The overridden method for waiting for clickability of web element on the page from Utilities class."""

        return ui.WebDriverWait(self.w, timeout).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, css_selector)))
```

This is a mapping of Main Page of YouTube ([https://youtube.com](https://youtube.com)): one button ("SIGN IN") and one method, which lead to the Login Page below:

```
"""Module LoginPage for mapping the login page of Youtube."""

from selenium.webdriver.support import ui
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from page_objects import PageObject, PageElement
import config
from utilities import Utilities


class LoginPage(PageObject, Utilities):
    """Class LoginPage for mapping the login page of Youtube."""

    # Mapping web elements on the page.
    email_field = PageElement(id_="identifierId")
    next_email_button = PageElement(id_="identifierNext")
    password_field = PageElement(css=".whsOnd.zHQkBf")
    next_password_button = PageElement(id_="passwordNext")
    done_button = PageElement(css=".ZFr60d.CeoRYc")

    def login(self, email=config.USER1["email"], password=config.USER1["password"]):
        """A method for login on the Youtube."""

        self.wait_clickable_by_id("identifierId")
        self.email_field = email
        self.wait_clickable_by_id("identifierNext")
        self.next_email_button.click()
        self.wait_invisibility_by_id("identifierNext")
        self.wait_clickable_by_css(".whsOnd.zHQkBf")
        self.password_field = password
        self.wait_clickable_by_id("passwordNext")
        self.next_password_button.click()

        try:

            self.wait_clickable_by_css(".ZFr60d.CeoRYc")
            self.done_button.click()

        except:

            pass

        self.wait_visibility_by_css("#avatar-btn")

    def wait_visibility_by_css(self, css_selector, timeout=config.DELAY1):
        """The overridden method for waiting for visibility of web element on the page from Utilities class."""

        return ui.WebDriverWait(self.w, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, css_selector)))

    def wait_invisibility_by_id(self, id_attribute, timeout=config.DELAY1):
        """The overridden method for waiting for invisibility of web element on the page from Utilities class."""

        return ui.WebDriverWait(self.w, timeout).until(
            EC.invisibility_of_element_located((By.ID, id_attribute)))

    def wait_clickable_by_id(self, id_attribute, timeout=config.DELAY1):
        """The overridden method for waiting for clickability of web element on the page from Utilities class."""

        return ui.WebDriverWait(self.w, timeout).until(
            EC.element_to_be_clickable((By.ID, id_attribute)))

    def wait_clickable_by_css(self, css_selector, timeout=config.DELAY1):
        """The overridden method for waiting for clickability of web element on the page from Utilities class."""

        return ui.WebDriverWait(self.w, timeout).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, css_selector)))
```

As you can see here we declared all input fields and buttons needed for the test. Also here are methods, an important one is "login()". And, finally, the code of our test:

```
"""Module YoutubeTest for testing different features of Youtube."""

import unittest

import config
from utilities import Utilities
from page_object_model.main_page import MainPage
from page_object_model.login_page import LoginPage


class YoutubeTest(unittest.TestCase, Utilities):
    """Class YoutubeTest for testing different features of Youtube."""

    # Set URL.
    URL = ""

    def setUp(self):
        """"Set up" -- method which is running before each test."""

        self._set_up()

    def test_login_to_youtube(self):
        """A method for login on the Youtube."""

        main_page = MainPage(self.driver, root_uri=config.DOMAIN)
        main_page.goto_login_page()
        login_page = LoginPage(self.driver)
        login_page.login(config.USER1["email"], config.USER1["password"])
        self.make_screenshot()
        print("Test 1: User is successfully logged in.")

    def tearDown(self):
        """"Tear down" -- method which is running after each test."""

        self._tear_down()


if __name__ == "__main__":
    unittest.main()
```

In the testing method ("test_login_to_youtube()"), we create our objects and call their corresponding methods.

As you can see -- everything is simple.

Click [here](https://github.com/ratmirasanov/demo_test_automation_project) for source code.

Used references:

- [Page Objects for Python](https://page-objects.readthedocs.io/en/latest/).
- [Unittest](https://docs.python.org/3/library/unittest.html).
- [Selenium with Python](https://selenium-python.readthedocs.io/).