# Rupval

Rupval is a puppetteer script to fetch daily USD - INR rates from various services like Western Union, Xoom, Ria & Remitly and send it via email.

Rupval is deployed on Heroku and runs the script everyday via node-scheduler.

### Tech

* NodeJS
* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API
* [node-schedule](https://github.com/node-schedule/node-schedule)
* [SendGrid](https://sendgrid.com/)
* Heroku

### Installation

```sh
$ cd rupval
$ npm install
$ npm start
```
