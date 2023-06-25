# [Hahow Backend Engineer Interview Project](https://github.com/hahow/hahow-recruit/blob/master/backend.md)

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  This is a <a href="https://github.com/nestjs/nest">Nest.js</a>
  and <a href="https://www.typescriptlang.org/">TypeScript</a> backend project that provides an API for accessing <b>Heroes data</b>. 
</p>

<p align="center">
  The development process of this project follows the <a href="https://trunkbaseddevelopment.com/">TBD Flow</a> methodology.
</p>

## Contents

- [Getting Started](#getting-started)

- [Installation](#installation)

- [Running the Application](#running-the-application)

- [Architecture Diagram](#architecture-diagram)

- [API Workflow Diagrams](#api-workflow-diagrams)

- [Code Comments Principles](#code-comments-principles)

- [Project Journey](#project-journey)

- [Roadmap](#roadmap)

- [Acknowledgments](#acknowledgments)

## Getting Started

1. Install [Node.js](https://nodejs.org/en) (recommend using the LTS version)
2. Install a code editor: [WebStorm](https://www.jetbrains.com/webstorm/download/#section=mac)
   or [Visual Studio Code](https://code.visualstudio.com/)
3. Install API testing tool: [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/download)

## Installation

```bash
$ git clone git@github.com:HackHow/hahow-backend.git
```

Move to the project directory.

```bahs
$ cd hahow-backend
```

```bahs
$ npm install
```

Create Environment file (.env file)

```bash
$ touch .env
```

Copy the variables from the .env.example file to the .env file

Modify the URLs of `HAHOW_HEROES_API_URL` and `HAHOW_AUTH_API_URL` as follows:

```dotenv
HAHOW_HEROES_API_URL="https://hahow-recruit.herokuapp.com/heroes"
HAHOW_AUTH_API_URL="https://hahow-recruit.herokuapp.com/auth"
PORT=3000
```

> Note: You can adjust the PORT value as needed. The default value is 3000.

## Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### Test

```bash
# API tests
$ npm run test
```

#### Here is a demonstration of testing the API endpoints using [Insomnia](https://insomnia.rest/download):

<img width="1278" alt="截圖 2023-06-25 下午5 13 54" src="https://github.com/HackHow/hahow-backend/assets/56557271/f680a8db-25c6-4763-a3e2-2dc890efcab7">

## Architecture Diagram

![Hahow Programming Flow Chart](https://github.com/HackHow/hahow-backend/assets/56557271/d7d2702c-3b96-4985-a984-7ad1f240bf01)

- **Controllers**: Handle HTTP requests and responses to the client, returning data about Heroes or a specific Hero.

- **Providers**: Offer services that provide data about Heroes or a specific Hero. This data is sourced from the
  responses
  obtained by making requests to the Hahow API.

- **Modules**: The Heroes module is injected into the AppModule using dependency injection, a primary method by which
  Nest.js organizes the structure of the application.

- **Guard**: Acts as a layer used for handling authentication. It ensures that incoming requests have the required
  permissions to access data about Heroes or a specific Hero that includes Profile information.

## API Workflow Diagrams

- **List Heroes and Authenticated List Heroes Endpoints**: The following diagram illustrates the workflow for
  the `GET /heroes` and the authenticated version of the same endpoint.

    ```mermaid
    sequenceDiagram
        Client ->>+ Guard: Get: http://localhost:3000/heroes
        Note over Guard, Hahow Auth API: Identity Verification Success
        Guard ->>+ Hahow Auth API: header: {"name": "hahow","password": "rocks"}
        Hahow Auth API ->>+ Guard: OK
        Guard ->>+ Heroes Controller: isAuthorized == true
        Heroes Controller ->>+ Heroes Service: Call getAllHeroesWithProfiles()
        Heroes Service ->>+ Hahow Heroes API: Request
        Hahow Heroes API ->>+ Heroes Service: Heroes Data
        loop Given Hero ID
            Heroes Service ->>+ Hahow Hero Profile API: Request
            Hahow Hero Profile API ->>+ Heroes Service: Profile Data
        end
        Heroes Service ->>+ Heroes Controller: Heroes Data with Profile
        Heroes Controller ->>+ Client: Repsonse (Data)
    
        Note over Guard, Hahow Auth API: Identity Verification Fail
        Guard ->>+ Hahow Auth API: header: {"show": "me the secret"}
        Hahow Auth API ->>+ Guard: Bad Request
        Guard ->>+ Heroes Controller: isAuthorized == false
        Heroes Controller ->>+ Heroes Service: getAllHeroes()
        Heroes Service ->>+ Hahow Heroes API: Request
        Hahow Heroes API ->>+ Heroes Service: Heroes Data
        Heroes Service ->>+ Heroes Controller: Heroes Data
        Heroes Controller ->>+ Client: Response (Data)
    ```

- **Single Hero and Authenticated Single Hero Endpoints**: The following diagram illustrates the workflow for
  the `GET /heroes/:heroId` and the authenticated version of the same endpoint.

    ```mermaid
    sequenceDiagram
        Client ->>+ Guard: Get: http://localhost:3000/heroes/:heroId
        Note over Guard, Hahow Auth API: Identity Verification Success
        Guard ->>+ Hahow Auth API: header: {"name": "hahow","password": "rocks"}
        Hahow Auth API ->>+ Guard: OK
        Guard ->>+ Heroes Controller: isAuthorized == true
        Heroes Controller ->>+ Heroes Service: Call getHeroWithProfilesById(heroId)
        Heroes Service ->>+ Hahow Heroes API: Request
        Hahow Heroes API ->>+ Heroes Service: Hero Data
        Heroes Service ->>+ Hahow Hero Profile API: Request
        Hahow Hero Profile API ->>+ Heroes Service: Profile Data
        Heroes Service ->>+ Heroes Controller: Hero Data with Profile
        Heroes Controller ->>+ Client: Repsonse (Data)
    
        Note over Guard, Hahow Auth API: Identity Verification Fail
        Guard ->>+ Hahow Auth API: header: {"show": "me the secret"}
        Hahow Auth API ->>+ Guard: Bad Request
        Guard ->>+ Heroes Controller: isAuthorized == false
        Heroes Controller ->>+ Heroes Service: getHeroById(heroId)
        Heroes Service ->>+ Hahow Heroes API: Request
        Hahow Heroes API ->>+ Heroes Service: Hero Data
        Heroes Service ->>+ Heroes Controller: Hero Data
        Heroes Controller ->>+ Client: Response (Data)
    ```

## Code Comments Principles

Commenting is an essential part of code readability and maintainability. In this project, comments are primarily used to
describe special cases in the code, such as unexpected behaviors or complex logic. Here are some specific situations
where comments are used:

- **Special Cases**: When a certain part of the code handles an exceptional or non-obvious case, a comment should be
  added to explain this.
  > For example: In this project, there is a case where a request to the Hahow `hero/:heroId` API
  occasionally returns a status code of 200 but no data. In such cases, a comment is added to describe the situation
  and the handled action. Here is the comment for this particular case: "When the status code is 200, but the data
  was
  not received, the message 'try it again' needs to be returned". This helps future contributors understand why the
  code is written in a certain way and what it's supposed to do.

Remember to always keep your comments concise and relevant. They should describe why the code is doing something, rather
than what it's doing. This will help future contributors better understand the intent behind your code.

## Project Journey

### Development Process

1. **Requirement Confirmation**: The first step was to understand the project requirements and the language needed for
   development.
2. **Observation and Clarification**: The project was carefully reviewed to identify any unclear or uncertain areas. Any
   issues or uncertainties were clarified with the stakeholder.
3. **Tool Confirmation**: The necessary development tools were identified and set up.
4. **Design Documentation**: A design document was written to outline how the project would be developed.
5. **Development Documentation and Time Estimation**: After finalizing the design document, a development document was
   created along with time estimates for each task.
6. **Development**: The actual coding began. Any issues encountered during this stage were addressed by revisiting the
   development document and making adjustments as necessary.

### Challenges and Solutions

1. **Lack of Experience with TypeScript and Nest.js**: As this was the first time using TypeScript and Nest.js, more
   time was required to read and understand the documentation.

    - **Solution**: Patience and practice. The documentation was read thoroughly and the learned concepts were applied
      during development.

2. **Inconsistent API Responses**: Occasionally, the API would return a successful status code but without the expected
   data.

    - **Solution**: Added special error handling for this case.

3. **Authentication Handling in Nest.js**: Previous experience with Express.js involved using middleware for
   authentication, but Nest.js introduced a new layer called Guard.

    - **Solution**: Spent time understanding the differences and uses of Guard layer and Middleware layer in Nest.js.

4. **Uncertainty with Folder Structure**: Even though Nest.js provided a GitHub repo with a recommended folder
   structure, it was unclear where certain files should be placed.

    - **Solution**: Consulted additional documentation and articles to create a clean and navigable folder structure.

5. **Limited Time and Experience with Testing**: The project had a one-week timeline, and there was limited prior
   experience with writing tests.

    - **Solution**: Focused on writing tests for the controller layer, while manually verifying the functionality of
      other layers.

## Roadmap

- [ ] **Add Database and Caching**: Store data fetched from external APIs for more efficient data retrieval.
- [ ] **Add CronJob**: Build a cron job to periodically update the stored data from the external API.
- [ ] **Add Router Module**: As the application grows more complex, managing APIs might become challenging. Adding a
  router module can help manage APIs more effectively.
- [ ] **Store User Data**: In the future, as the number of authenticated identities increases, we can store user
  permissions in a database to avoid repeatedly requesting the external Auth API. This would allow us to track which
  users are authorized to access sensitive data.

## Acknowledgments

[Nest.js documentation](https://docs.nestjs.com/)

[Nest.js Folder Structure](https://github.com/nestjs/typescript-starter)

[Best way to structure your directory code Nestjs](https://medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs-a06c7a641401)

[IT help Articles](https://ithelp.ithome.com.tw/users/20119338/ironman/3880)

[The Ultimate Guide (2023)](https://masteringbackend.com/posts/nestjs-typescrpt-ultimate-guide#nestjs-the-framework)

[Trunk Based Development](https://trunkbaseddevelopment.com/)