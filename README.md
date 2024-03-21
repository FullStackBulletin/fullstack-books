# fullstack books

[![main](https://github.com/FullStackBulletin/fullstack-books/actions/workflows/test.yaml/badge.svg)](https://github.com/FullStackBulletin/fullstack-books/actions/workflows/test.yaml)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)


A static API to discover inspiring books for ambitious full-stack developers



## Usage

The base URL of the API is `https://fullStackbulletin.github.io/fullstack-books`.

API Documentation is available as OpenAPI specification:

  - [OpenAPI definition (YAML)](https://fullStackbulletin.github.io/fullstack-books/openapi.yml)
  - [OpenAPI definition (JSON)](https://fullStackbulletin.github.io/fullstack-books/openapi.json)

[![Open API V3](https://img.shields.io/badge/open--API-in--editor-brightgreen.svg?style=flat&label=open-api-v3)](https://editor-next.swagger.io/?url=https%3A%2F%2FfullStackbulletin.github.io%2Ffullstack-books%2Fopenapi.yml)


---

<!-- openapi -->
## The full-stack books API

> Version 1.0.0

A collection of books curated for full-stack developers and aspiring ones. Brought to you by FullStackBulletin

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| GET | [/authors/ids.json](#getauthorsidsjson) | Retrieve all the ids of the available book authors |
| GET | [/authors/all.json](#getauthorsalljson) | Retrieve all the available book authors |
| GET | [/authors/stats.json](#getauthorsstatsjson) | Retrieve stats about the available book authors |
| GET | [/authors/{authorId}.json](#getauthorsauthoridjson) | Retrieve the details of a given author |
| GET | [/books/ids.json](#getbooksidsjson) | Retrieve all the ids of the available books |
| GET | [/books/all.json](#getbooksalljson) | Retrieve all the available books |
| GET | [/books/stats.json](#getbooksstatsjson) | Retrieve stats about the available books |
| GET | [/books/{bookId}.json](#getbooksbookidjson) | Retrieve the details of a given book |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| AuthorIDs | [#/components/schemas/AuthorIDs](#componentsschemasauthorids) |  |
| Stats | [#/components/schemas/Stats](#componentsschemasstats) |  |
| Author | [#/components/schemas/Author](#componentsschemasauthor) |  |
| AuthorWithBooks | [#/components/schemas/AuthorWithBooks](#componentsschemasauthorwithbooks) |  |
| BookIDs | [#/components/schemas/BookIDs](#componentsschemasbookids) |  |
| Book | [#/components/schemas/Book](#componentsschemasbook) |  |

## Path Details

***

### [GET]/authors/ids.json

- Summary  
Retrieve all the ids of the available book authors

- Description  
Retrieve all the ids of the available book authors

#### Responses

- 200 OK

`application/json`

```ts
[]
```

***

### [GET]/authors/all.json

- Summary  
Retrieve all the available book authors

- Description  
Retrieve all the available book authors

#### Responses

- 200 OK

`application/json`

```ts
{
  name?: string
  slug?: string
  url?: string
}[]
```

***

### [GET]/authors/stats.json

- Summary  
Retrieve stats about the available book authors

- Description  
Retrieve stats about the available book authors

#### Responses

- 200 OK

`application/json`

```ts
{
  total?: number
  all?: string
  ids?: string
  urlPrefix?: string
}
```

***

### [GET]/authors/{authorId}.json

- Summary  
Retrieve the details of a given author

- Description  
Retrieve the details of a given author

#### Responses

- 200 OK

`application/json`

```ts
{
  name?: string
  slug?: string
  url?: string
  books: {
    slug?: string
    title?: string
    subtitle?: string
    edition?: number
    authors: {
      name?: string
      slug?: string
      url?: string
    }
    cover?: string
    links: {
      amazon_us?: string
      amazon_uk?: string
      free?: string
    }
    description?: string
    url?: string
    descriptionHtml?: string
  }[]
}
```

***

### [GET]/books/ids.json

- Summary  
Retrieve all the ids of the available books

- Description  
Retrieve all the ids of the available books

#### Responses

- 200 OK

`application/json`

```ts
[]
```

***

### [GET]/books/all.json

- Summary  
Retrieve all the available books

- Description  
Retrieve all the available books

#### Responses

- 200 OK

`application/json`

```ts
{
  slug?: string
  title?: string
  subtitle?: string
  edition?: number
  authors: {
    name?: string
    slug?: string
    url?: string
  }
  cover?: string
  links: {
    amazon_us?: string
    amazon_uk?: string
    free?: string
  }
  description?: string
  url?: string
  descriptionHtml?: string
}[]
```

***

### [GET]/books/stats.json

- Summary  
Retrieve stats about the available books

- Description  
Retrieve stats about the available books

#### Responses

- 200 OK

`application/json`

```ts
{
  total?: number
  all?: string
  ids?: string
  urlPrefix?: string
}
```

***

### [GET]/books/{bookId}.json

- Summary  
Retrieve the details of a given book

- Description  
Retrieve the details of a given book

#### Responses

- 200 OK

`application/json`

```ts
{
  slug?: string
  title?: string
  subtitle?: string
  edition?: number
  authors: {
    name?: string
    slug?: string
    url?: string
  }
  cover?: string
  links: {
    amazon_us?: string
    amazon_uk?: string
    free?: string
  }
  description?: string
  url?: string
  descriptionHtml?: string
}
```

## References

### #/components/schemas/AuthorIDs

```ts
[]
```

### #/components/schemas/Stats

```ts
{
  total?: number
  all?: string
  ids?: string
  urlPrefix?: string
}
```

### #/components/schemas/Author

```ts
{
  name?: string
  slug?: string
  url?: string
}
```

### #/components/schemas/AuthorWithBooks

```ts
{
  name?: string
  slug?: string
  url?: string
  books: {
    slug?: string
    title?: string
    subtitle?: string
    edition?: number
    authors: {
      name?: string
      slug?: string
      url?: string
    }
    cover?: string
    links: {
      amazon_us?: string
      amazon_uk?: string
      free?: string
    }
    description?: string
    url?: string
    descriptionHtml?: string
  }[]
}
```

### #/components/schemas/BookIDs

```ts
[]
```

### #/components/schemas/Book

```ts
{
  slug?: string
  title?: string
  subtitle?: string
  edition?: number
  authors: {
    name?: string
    slug?: string
    url?: string
  }
  cover?: string
  links: {
    amazon_us?: string
    amazon_uk?: string
    free?: string
  }
  description?: string
  url?: string
  descriptionHtml?: string
}
```

<!-- openapi -->

---

## Suggest a book

If you want to suggest a new book here's how you can do that.

- [Fork this repository](https://github.com/FullStackBulletin/fullstack-books/fork)
- Edit the file [`src/books.yml`](/src/books.yml) and append the new book at the bottom (make sure to follow the spec by looking at the other books).
- Make sure to place the cover picture in the [`src/covers`](/src/covers/) folder and reference it in the `cover` field of the book. Please follow the naming convention and keep the file size small.
- Run `npm run test && npm run build`
- If all looks good, commit your changes
- Open a PR against the original repository

### Import from Amazon

If the book is available on Amazon, you can use the following command to import the book details:

```bash
pnpm run import -- <bookASIN1> <bookASIN2> <bookASIN3> ...
```

Where `<bookASIN1>`, `<bookASIN2>`, `<bookASIN3>`, etc. are the ASINs of the books you want to import.

For example, if the book URL is `https://www.amazon.com/Node-js-Design-Patterns-production-grade-applications/dp/1839214112/`, the ASIN is `1839214112`, so you can run:

```bash
pnpm run import -- 1839214112
```

This will automatically fetch the book details from Amazon and append them to the `src/books.yml` file. It will also download the book cover and place it under `src/covers/`.

#### Amazon captcha check

Sometimes Amazon might trigger a captcha check if you are not an authenticated user. If you are running the import command and you are getting a captcha check, you can try to run the following command to bypass it:

```bash
pnpm run import -- --cookies <cookies> <bookASIN1> <bookASIN2> <bookASIN3> ...
```

Where `<cookies>` is a cookie string taken from an authenticated session on Amazon. You can get it by inspecting the cookies in your browser and copying the `Cookie` header from the request.


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/FullStackBulletin/fullstack-books/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
