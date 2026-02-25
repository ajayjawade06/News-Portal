Multilingual News Portal - Architecture Diagram
==============================================

This document contains the PlantUML code for the high-level architecture diagram of your project. 
You can copy this code into any PlantUML-compatible tool to render the diagram, or keep this file 
as a reference and open it in Microsoft Word (Word can open .md or .txt files) and then save it as a .docx file.

----------------------------------------
PlantUML Diagram Source Code
----------------------------------------

```plantuml
@startuml MultilingualNewsPortal

title Multilingual News Portal - High Level Architecture

skinparam componentStyle rectangle
skinparam shadowing false

' Actors
actor Reporter
actor Visitor

' Frontend
package "Frontend (Vite + React)" {
  [Browser UI\n(React Router, Pages, Components)] as FE_UI
  [NewsContext\n(State Management)] as FE_CTX
  [Axios API Client\n(src/utils/api.js)] as FE_API
}

' Backend
package "Backend (Node.js + Express)" {
  [Express App\n(server.js)] as BE_APP
  
  package "Routes" {
    [Auth Routes\n(/api/auth)\nroutes/auth.js] as BE_AUTH_ROUTES
    [News Routes\n(/api/news)\nroutes/news.js] as BE_NEWS_ROUTES
  }

  package "Middleware" {
    [Auth Middleware\n(middleware/auth.js)] as BE_AUTH_MW
    [Upload Middleware\n(middleware/upload.js)] as BE_UPLOAD_MW
    [CORS & JSON Parsing\n(server.js)] as BE_CORE_MW
  }

  package "Models (Mongoose)" {
    [Reporter Model\n(models/Reporter.js)] as BE_REPORTER_MODEL
    [News Model\n(models/News.js)] as BE_NEWS_MODEL
  }

  package "Utils" {
    [Translator Utility\n(utils/translator.js)] as BE_TRANSLATOR
  }
}

' Data layer & external services
database "MongoDB\n(multilingual_news)" as DB
cloud "Translation API(s)\n(used by translator.js)" as TRANS_API

' Relationships: users -> frontend
Reporter --> FE_UI : uses (login, dashboard,\ncreate/edit/manage news)
Visitor --> FE_UI : uses (browse news,\nread details)

' Frontend internals
FE_UI --> FE_CTX : uses context\nfor news & auth
FE_UI --> FE_API : calls REST API\nvia Axios
FE_API --> BE_APP : HTTP(S) /api/*

' Backend internals
BE_APP --> BE_CORE_MW : uses middleware
BE_APP --> BE_AUTH_ROUTES
BE_APP --> BE_NEWS_ROUTES

BE_AUTH_ROUTES --> BE_AUTH_MW : protect routes
BE_AUTH_ROUTES --> BE_REPORTER_MODEL : CRUD, auth

BE_NEWS_ROUTES --> BE_AUTH_MW : protect reporter endpoints
BE_NEWS_ROUTES --> BE_UPLOAD_MW : handle image uploads
BE_NEWS_ROUTES --> BE_NEWS_MODEL : CRUD news
BE_NEWS_ROUTES --> BE_TRANSLATOR : translate content

' Data & external
BE_REPORTER_MODEL --> DB
BE_NEWS_MODEL --> DB

BE_TRANSLATOR --> TRANS_API : translate titles,\ncontent, summaries

@enduml
```

