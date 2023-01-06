# Backend con Node
## Proyecto de módulo: nodepop
#### Elisa Levy Gracia | 06/01/2023  

## Overview

This repository implements an add API. This API provides developers a set of tools for accessing a collection of adds in various ways, as well as the option to create new ones.

## Installation and setting up

### 1. Dependencies

First, be sure to have installed `Node.js` and the `npm` package manager. Then, navigate to the project root and run

```
npm install 
```

to install dependencies.

You will also need to have installed MongoDB as the local database for the project. Make sure that the server is running before continuing. (follow the official instructions for your system [here](https://www.mongodb.com/docs/manual/installation/#:~:text=of%20MongoDB%20instead.-,MongoDB%20Installation%20Tutorials,-MongoDB%20installation%20tutorials)). It should be running on the default port `27017`. 

### 2. Database ingestion

To ingest sample adds onto the database, just run

```
npm run init-db
```

This will create the `nodepopdb` database and an `add` collection.

With everything set up, you should be able to start the app:

```
DEBUG=nodepop:* npm start 
```

and be able to access it in `localhost:3000`. Make sure that the port is not in use by other applications.

## Usage

### 1. Retrieving adds

- `GET/apiv1/adds`. Returns a JSON object will all adds in the collection.
- Filter options:
    - `tag=tagName`. (`tagName`: `string`) Filters by the specified `tagName`.
    - `venta=isSale`. (`isSale`: `bool`) Gets adds that are categorised for sale or as looking for.
    - `nombre=name`. (`name`: `string`) Gets adds whose field `nombre` starts with / matches `name`.
    - `precio=price`. (`price`: [`number`, `string`]) 
        - `price` is a number: returns adds whose field `precio` matches `price`.
        - `price` has the format `-n`, where `n` is a number: returns adds whose field `precio` is lower or equal than `n`. 
        - `price` has the format `n-`, where `n` is a number: returns adds whose field `precio` is greater than `n`.
        - `price` has the format `n-m`, where `n` and `m` are a number: returns adds whose field `precio` is between `n` and `m`, inclusive.
- Return options:
    - `sort=fieldName`. (`fieldName`: `string`). Sorts the adds ascending by the specified `fieldName`.
    - Pageing fields:
        - `start=n` (`n`: `int`). Specifies the starting add to be shown. That is, if a query returns 10 adds, `start=5` will make it so that only the last 5 adds are shown.
        - `end=n` (`n`: `int`). Specifies the starting add to be shown. That is, if a query returns 10 adds, `end=5` will make it so that only the first 5 adds are shown.

Example **GET**

```
http://localhost:3000/apiv1/adds?tag=mobile&venta=false&nombre=ip&precio=50-&start=0&limit=2&sort=precio
```

### 2. Retrieving existing tags

- `GET /apiv1/tags`. Returns a list with all existing, unique tags.

Example

```
http://localhost:3000/apiv1/tags
```

### 3. Retrieving images

- `GET /images/$imageName`. Returns the specified add image (`$imageName`). Adds with an image specify their associated image name in the `foto` field.

Example

```
http://localhost:3000/images/iphone.jpg
```

## Architecture

All functionality for version v1 of the add retrieval API is implemented in `routes/apiv1.js`. Each route is separately defined, for each HTTP methods supported. 
Static resource retrieval is not considered a part of the add query engine, and so it has been implemented in the main `app.js` file. 


