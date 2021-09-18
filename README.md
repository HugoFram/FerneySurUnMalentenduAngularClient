# FerneySurUnMalentendu

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Operations

## Environment variables 

Environment variables such as the baseURL to which the requests are sent are stored in a config.json file manually updated directly in the deployed folder.

## Restart server

To restart the Apache 2 server, run `service apache2 restart`. 

## Deploy code

To deploy the code on either the Test or Production environments, run the below commands replacing <ENV> by Test or Production.
Note that this only works in the Raspberry PI on which to deploy the code is in the local network. If it's not the case, use 217.162.196.67 IP instead.
`npm run build --prod`
`scp -r C:/Users/Hugo/Documents/FerneySurUnMalentendu/dist/FerneySurUnMalentendu/* pi@192.168.0.157:/var/www/html/FerneySurUnMalentendu/<ENV>/`
