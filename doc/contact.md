# Contact API Spec

## Create Contact

Endpoint: POST /api/contacts

Request Headers:

- X-API-TOKEN: token()

Request body:

```json
{
  "firstName": "Faisal Abu",
  "lastName": "Bakar Riza",
  "email": "faisal@gmail.com",
  "phone": "1231231"
}
```

Response body (success):

```json
{
  "data": {
    "id": 1,
    "firstName": "Faisal Abu",
    "lastName": "Bakar Riza",
    "email": "faisal@gmail.com",
    "phone": "1231231"
  }
}
```

Response body (Failed):

```json
{
  "errors": "firstname must not blank"
}
```

## Get Contact

Endpoint: GET /api/contacts/:id

Request Headers:

- X-API-TOKEN: token()

Response body (success):

```json
{
  "data": {
    "id": 1,
    "firstName": "Faisal Abu",
    "lastName": "Bakar Riza",
    "email": "faisal@gmail.com",
    "phone": "1231231"
  }
}
```

Response body (Failed):

```json
{
  "errors": "Contact is not found"
}
```

## Update Contact

Endpoint: PUT /api/contacts/:id

Request Headers:

- X-API-TOKEN: token()

Request body:

```json
{
  "firstName": "Faisal Abu Bakar",
  "lastName": " Riza",
  "email": "faisal@gmail.com",
  "phone": "1231231"
}
```

Response body (success):

```json
{
  "data": {
    "id": 1,
    "firstName": "Faisal Abu Bakar ",
    "lastName": "Riza",
    "email": "faisal@gmail.com",
    "phone": "1231231"
  }
}
```

Response body (Failed):

```json
{
  "errors": "firstname must not blank"
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/:id

Request Headers:

- X-API-TOKEN: token()

Response body (success):

```json
{
  "data": "OK"
}
```

Response body (Failed):

```json
{
  "errors": "contact is not found"
}
```

## Search Contact

Endpoint: GET /api/contacts

Query Parameter:

- name : string, contact firstname or lastname, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- size: number, default 10

Request Headers:

- X-API-TOKEN: token()

Response body (success):

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Faisal Abu Bakar ",
      "lastName": "Riza",
      "email": "faisal@gmail.com",
      "phone": "1231231"
    },
    {
      "id": 2,
      "firstName": "Faisal Abu Bakar ",
      "lastName": "Riza",
      "email": "faisal@gmail.com",
      "phone": "1231231"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

Response body (Failed):

```json
{
  "errors": "unauthorized"
}
```
