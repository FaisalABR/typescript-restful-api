# Address API Spec

## Create Address

Endpoint: POST /api/contacts/:idContacs/addresses

Request Headers:

- X-API-TOKEN: token()

Request body:

```json
{
  "street": "Jl. Damai",
  "city": "Jakarta Selatan",
  "province": "DKI Jakarta",
  "country": "Indonesia",
  "postalCode": "12323"
}
```

Response body (success):

```json
{
  "data": {
    "id": 1,
    "street": "Jl. Damai",
    "city": "Jakarta Selatan",
    "province": "DKI Jakarta",
    "country": "Indonesia",
    "postalCode": "12323"
  }
}
```

Response body (Failed):

```json
{
  "errors": "street must not blank"
}
```

## Get Address

Endpoint: GET /api/contacts/:idContacs/addresses/:idAddress

Request Headers:

- X-API-TOKEN: token()

Response body (success):

```json
{
  "data": {
    "id": 1,
    "street": "Jl. Damai",
    "city": "Jakarta Selatan",
    "province": "DKI Jakarta",
    "country": "Indonesia",
    "postalCode": "12323"
  }
}
```

Response body (Failed):

```json
{
  "errors": "Address is not found"
}
```

## Update Address

Endpoint: PUT /api/contacts/:idContacs/addresses/:idAddresses

Request Headers:

- X-API-TOKEN: token()

Request body:

```json
{
  "street": "Jl. Damai 74",
  "city": "Jakarta Selatan",
  "province": "DKI Jakarta",
  "country": "Indonesia",
  "postalCode": "12323"
}
```

Response body (success):

```json
{
  "data": {
    "id": 1,
    "street": "Jl. Damai 74",
    "city": "Jakarta Selatan",
    "province": "DKI Jakarta",
    "country": "Indonesia",
    "postalCode": "12323"
  }
}
```

Response body (Failed):

```json
{
  "errors": "street must not blank"
}
```

## Remove Address

Endpoint: DELETE /api/contacts/:idContacs/addresses/:idAddresses

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
  "errors": "Address is not found"
}
```

## List Address

Endpoint: GET /api/contacts/:idContacs/addresses

Request Headers:

- X-API-TOKEN: token()

Response body (success):

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jl. Damai 74",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "country": "Indonesia",
      "postalCode": "12323"
    },
    {
      "id": 2,
      "street": "Jl. Damai 74",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "country": "Indonesia",
      "postalCode": "12323"
    }
  ]
}
```

Response body (Failed):

```json
{
  "errors": "contact is not found"
}
```
