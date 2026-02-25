Multilingual News Portal – Diagrams & Data Design
===============================================

This document contains all required diagrams and data design sections for the project.
You can open this file in any editor, or open it directly in Microsoft Word and then
save it as a `.docx` file for submission.

----------------------------------------
3.1 Entity Relationship Diagram (ERD)
----------------------------------------

Conceptual ERD between `Reporter` and `News`:

```plantuml
@startuml ERD
entity "Reporter" as Reporter {
  * reporter_id : ObjectId
  --
  username : String
  email : String
  password : String (hashed)
  createdAt : Date
  updatedAt : Date
}

entity "News" as News {
  * news_id : ObjectId
  --
  baseLanguage : String (en/hi/mr)
  title_en : String
  title_hi : String
  title_mr : String
  subHeading_en : String
  subHeading_hi : String
  subHeading_mr : String
  content_en : String
  content_hi : String
  content_mr : String
  location : String
  category : String
  image : String
  published : Boolean
  views : Number
  createdAt : Date
  updatedAt : Date
  reporter_id : ObjectId
}

Reporter ||--o{ News : "creates"
@enduml
```

----------------------------------------
3.2 Data Flow Diagram (DFD – Level 0)
----------------------------------------

```plantuml
@startuml DFD0
actor "Visitor" as Visitor
actor "Reporter" as Reporter

rectangle "Frontend (React SPA)" as FE
rectangle "Backend API (Express)" as BE
database "MongoDB" as DB
cloud "Translation Service\n(translateNewsContent)" as TR

Visitor --> FE : Browse news,\nview details
Reporter --> FE : Login,\nmanage news

FE --> BE : HTTP /api/auth/*,\n/api/news/*
BE --> DB : Read/Write\nReporter, News
BE --> TR : Send text for\ntranslation
TR --> BE : Translated\ncontent
BE --> FE : JSON responses
@enduml
```

------------------------------
3.3 Object Diagram (Snapshot)
------------------------------

```plantuml
@startuml ObjectDiagram
object reporter1 {
  id = "R1"
  username = "editor"
  email = "editor@example.com"
}

object news1 {
  id = "N1"
  baseLanguage = "en"
  title_en = "Local Event"
  location = "chandrapur"
  category = "Politics"
  published = true
  views = 125
  reporter_id = "R1"
}

object news2 {
  id = "N2"
  baseLanguage = "mr"
  title_mr = "Rajura News"
  location = "rajura"
  category = "Sports"
  published = false
  views = 0
  reporter_id = "R1"
}

reporter1 --> news1 : created
reporter1 --> news2 : created
@enduml
```

-------------------------
3.4 Class Diagram (Backend)
-------------------------

```plantuml
@startuml ClassDiagram

class Reporter {
  - ObjectId _id
  - String username
  - String email
  - String password
  + comparePassword(pw : String) : Promise<Boolean>
}

class News {
  - ObjectId _id
  - String baseLanguage
  - Map<String,String> title
  - Map<String,String> subHeading
  - Map<String,String> content
  - String location
  - String category
  - String image
  - Boolean published
  - Number views
  - Date createdAt
  - Date updatedAt
}

class AuthController {
  + register(username,email,password)
  + login(email,password)
  + me(token)
}

class NewsController {
  + list(location,category)
  + latest()
  + trending()
  + getById(id)
  + create(data,image)
  + update(id,data,image)
  + delete(id)
  + togglePublish(id)
}

class TranslatorService {
  + translateNewsContent(title,content,baseLanguage,subHeading) : Object
}

class AuthMiddleware {
  + authenticateReporter(req,res,next)
}

Reporter "1" --> "0..*" News : creates
NewsController --> News
AuthController --> Reporter
NewsController --> TranslatorService
AuthMiddleware --> Reporter
@enduml
```

------------------
3.5 Use Case Diagrams
------------------

### 3.5.1 Visitor Use Cases

```plantuml
@startuml UseCase_Visitor
actor Visitor

usecase "View Latest News" as UC1
usecase "View Trending News" as UC2
usecase "Filter News\nby Location/Category" as UC3
usecase "Read News Details" as UC4

Visitor --> UC1
Visitor --> UC2
Visitor --> UC3
Visitor --> UC4
@enduml
```

### 3.5.2 Reporter Use Cases

```plantuml
@startuml UseCase_Reporter
actor Reporter

usecase "Register" as UCR1
usecase "Login" as UCR2
usecase "Create News\n(with auto-translation)" as UCR3
usecase "Edit News\n(re-translate if changed)" as UCR4
usecase "Publish / Unpublish News" as UCR5
usecase "Delete News" as UCR6
usecase "View All News\n(including drafts)" as UCR7

Reporter --> UCR1
Reporter --> UCR2
Reporter --> UCR3
Reporter --> UCR4
Reporter --> UCR5
Reporter --> UCR6
Reporter --> UCR7
@enduml
```

-------------------------------------------
3.6 Activity Diagram – Create News Process
-------------------------------------------

```plantuml
@startuml Activity_CreateNews
start
:Reporter fills news form\n(title, subHeading, content,\nbaseLanguage, location, category);
:Click "Submit";

:Frontend sends POST /api/news\nwith form data + image;
:Backend validates input;

if (valid?) then (yes)
  :Call translateNewsContent();
  if (translation success?) then (yes)
    :Build multilingual title,\nsubHeading, content;
  else (no)
    :Use base language as\nfallback for all languages;
  endif
  :Save News document in MongoDB;
  :Return success response;
  :Frontend shows success message\nand redirects to manage page;
else (no)
  :Return validation error;
  :Frontend shows error message;
endif

stop
@enduml
```

-----------------------------------------
3.7 Collaboration (Communication) Diagram
-----------------------------------------

```plantuml
@startuml Collaboration
actor Reporter

participant "Login Page\n(React)" as LoginUI
participant "Auth API\n(/api/auth/login)" as AuthAPI
participant "Reporter Model" as ReporterModel
participant "Dashboard UI\n(React)" as DashUI
participant "News API\n(/api/news)" as NewsAPI
participant "News Model" as NewsModel
participant "TranslatorService" as TR

Reporter -> LoginUI : enter email, password
LoginUI -> AuthAPI : POST /api/auth/login
AuthAPI -> ReporterModel : findOne(email)
ReporterModel --> AuthAPI : reporter + hashed password
AuthAPI -> ReporterModel : comparePassword()
AuthAPI --> LoginUI : JWT token
LoginUI -> DashUI : open dashboard with token

Reporter -> DashUI : fill create-news form
DashUI -> NewsAPI : POST /api/news (+token)
NewsAPI -> TR : translateNewsContent()
TR --> NewsAPI : translated fields
NewsAPI -> NewsModel : save()
NewsModel --> NewsAPI : saved document
NewsAPI --> DashUI : success response
@enduml
```

----------------------
3.8 Deployment Diagram
----------------------

```plantuml
@startuml Deployment
node "Client Machine" {
  artifact "Browser\n(React SPA)" as Browser
}

node "Frontend Hosting\n(Netlify/Vercel)" {
  artifact "Static Files\n(HTML, CSS, JS)" as FE
}

node "Backend Server\n(Render/Railway/Node)" {
  artifact "Express App\n(server.js)" as BE
}

node "MongoDB Atlas\n(or Local MongoDB)" as DB

node "External Translation API" as TR

Browser --> FE : HTTPS
FE --> BE : HTTPS /api/*
BE --> DB : MongoDB protocol
BE --> TR : HTTPS
@enduml
```

----------------------
3.9 Component Diagram
----------------------

```plantuml
@startuml ComponentDiagram
component "React SPA" {
  [Navbar]
  [Home Page]
  [Location Pages\n(Maharashtra, Chandrapur,\nKorpana, Rajura)]
  [NewsDetail Page]
  [Dashboard]
  [CreateNews Page]
  [EditNews Page]
  [ManageNews Page]
  [NewsContext]
  [Axios API Client]
}

component "Auth API\n(/api/auth)" {
  [Register Endpoint]
  [Login Endpoint]
  [Me Endpoint]
}

component "News API\n(/api/news)" {
  [List News]
  [Latest News]
  [Trending News]
  [Get News By Id]
  [Create News]
  [Update News]
  [Delete News]
  [Toggle Publish]
  [Increment Views]
}

component "Middleware" {
  [Auth Middleware]
  [Upload Middleware]
}

component "Models" {
  [Reporter Model]
  [News Model]
}

component "Translator Service\n(translateNewsContent)" as TR

[Axios API Client] --> "Auth API\n(/api/auth)"
[Axios API Client] --> "News API\n(/api/news)"
"News API\n(/api/news)" --> [News Model]
"Auth API\n(/api/auth)" --> [Reporter Model]
"News API\n(/api/news)" --> TR
"News API\n(/api/news)" --> [Upload Middleware]
"Auth API\n(/api/auth)" --> [Auth Middleware]
"News API\n(/api/news)" --> [Auth Middleware]
@enduml
```

-----------------
3.10 Table Design
-----------------

Relational-style view of the MongoDB collections.

**Table: Reporter**

| Column       | Type     | Constraints             | Description                   |
|-------------|----------|-------------------------|-------------------------------|
| reporter_id | ObjectId | PK                      | Unique reporter ID            |
| username    | VARCHAR  | NOT NULL, UNIQUE        | Login name                    |
| email       | VARCHAR  | NOT NULL, UNIQUE        | Reporter email                |
| password    | VARCHAR  | NOT NULL                | Hashed password               |
| createdAt   | DATETIME | NOT NULL (default NOW)  | Created timestamp             |
| updatedAt   | DATETIME | NOT NULL (auto)         | Last update timestamp         |

**Table: News**

| Column        | Type     | Constraints                                                  | Description                          |
|--------------|----------|--------------------------------------------------------------|--------------------------------------|
| news_id      | ObjectId | PK                                                           | Unique news ID                       |
| baseLanguage | VARCHAR  | NOT NULL, CHECK in ('en','hi','mr')                          | Original language                    |
| title_en     | TEXT     | NOT NULL                                                     | English title                        |
| title_hi     | TEXT     |                                                              | Hindi title                          |
| title_mr     | TEXT     |                                                              | Marathi title                        |
| subHeading_en| TEXT     |                                                              | English subheading                   |
| subHeading_hi| TEXT     |                                                              | Hindi subheading                     |
| subHeading_mr| TEXT     |                                                              | Marathi subheading                   |
| content_en   | TEXT     | NOT NULL                                                     | English content                      |
| content_hi   | TEXT     |                                                              | Hindi content                        |
| content_mr   | TEXT     |                                                              | Marathi content                      |
| location     | VARCHAR  | NOT NULL, CHECK in ('maharashtra','chandrapur','korpana','rajura') | Coverage location             |
| category     | VARCHAR  | NOT NULL                                                     | Category (Politics, Sports, etc.)    |
| image        | VARCHAR  | NULL                                                         | Image path                           |
| published    | BOOLEAN  | NOT NULL DEFAULT false                                       | Publish status                       |
| views        | INT      | NOT NULL DEFAULT 0                                           | View counter                         |
| reporter_id  | ObjectId | FK -> Reporter(reporter_id)                                  | Author                               |
| createdAt    | DATETIME | NOT NULL                                                     | Created timestamp                    |
| updatedAt    | DATETIME | NOT NULL                                                     | Updated timestamp                    |

-------------------
3.11 Data Dictionary
-------------------

**Entity: Reporter**

| Field     | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| _id       | ObjectId | Unique reporter identifier                       |
| username  | String   | Reporter login name                              |
| email     | String   | Reporter email (unique, lowercased)             |
| password  | String   | Hashed password (bcrypt)                         |
| createdAt | Date     | Auto-set creation time                           |
| updatedAt | Date     | Auto-set last update time                        |

**Entity: News**

| Field         | Type              | Description                                                    |
|---------------|-------------------|----------------------------------------------------------------|
| _id           | ObjectId          | Unique news identifier                                         |
| baseLanguage  | String (en/hi/mr) | Language in which reporter originally wrote the article        |
| title.en      | String            | Title in English                                               |
| title.hi      | String            | Title in Hindi                                                 |
| title.mr      | String            | Title in Marathi                                               |
| subHeading.en | String            | Subheading in English                                          |
| subHeading.hi | String            | Subheading in Hindi                                            |
| subHeading.mr | String            | Subheading in Marathi                                          |
| content.en    | String            | Full content in English                                        |
| content.hi    | String            | Full content in Hindi                                          |
| content.mr    | String            | Full content in Marathi                                        |
| location      | String            | One of: maharashtra, chandrapur, korpana, rajura              |
| category      | String            | News category (Politics, Sports, Crime, etc.)                  |
| image         | String            | Relative path to uploaded image (`/uploads/...`)               |
| published     | Boolean           | Whether article is visible to public users                     |
| views         | Number            | Non-negative integer count of detail-page views                |
| createdAt     | Date              | Auto-set creation time                                         |
| updatedAt     | Date              | Auto-set last update time                                      |

