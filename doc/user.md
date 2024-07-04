# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "username": "faisalabu",
  "password": "rahasia",
  "name": "Faisal Abu"
}
```

Response (Success):

```json
{
  "username": "faisalabu",
  "name": "Faisal Abu"
}
```

Response (Failed):

```json
{
  "errors": "username must not be blank, ..."
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
  "username": "faisalabu",
  "password": "rahasia"
}
```

Response (Success):

```json
{
  "data": {
    "username": "faisalabu",
    "name": "Faisal Abu",
    "token": "uuid"
  }
}
```

Response (Failed):

```json
{
  "errors": "username or password are wrong"
}
```

## Update User

Endpoint: PATCH /api/users/current

Request Headers:

- X-API-TOKEN : token()

Request Body:

```json
{
  "username": "faisalabubakar"
}
```

Response (Success):

```json
{
  "data": {
    "username": "faisalabubakar",
    "name": "Faisal Abu"
  }
}
```

Response (Failed):

```json
{
  "errors": "unauthorized"
}
```

## Get User

Endpoint: GET /api/users/current

Request Headers:

- X-API-TOKEN : token()

Response (Success):

```json
{
  "data": {
    "username": "faisalabu",
    "name": "Faisal Abu"
  }
}
```

Response (Failed):

```json
{
  "errors": "unauthorized"
}
```

## Logout User

Endpoint: DELETE /api/users/current

Request Headers:

- X-API-TOKEN : token()

Response (Success):

```json
{
  "message": "ok"
}
```

Response (Failed):

```json
{
  "errors": "unauthorized"
}
```
