```mermaid
---
config:
  theme: redux-color
---
erDiagram
    User ||--|{ Product : 가진다
    User ||--|{ Article : 작성한다
    User ||--|{ Comment : 작성한다
    User ||--|{ ProductLike : 좋아요를_누른다
    User ||--|{ ArticleLike : 좋아요를_누른다
    Product ||--o{ Comment : 댓글을_가진다
    Product ||--|{ ProductLike : 좋아요를_받는다
    Article ||--o{ Comment : 댓글을_가진다
    Article ||--|{ ArticleLike : 좋아요를_받는다
    User {
        String id PK
        String email
        String nickname
        String imageUrl
        String password
        DateTime createdAt
        DateTime updatedAt
    }
    Product {
        String id PK
        String productName
        String description
        Int price
        String[] tags
        String imageUrl
        DateTime createdAt
        DateTime updatedAt
        String userId FK
    }
    Article {
        String id PK
        String title
        String content
        String imageUrl
        DateTime createdAt
        DateTime updatedAt
        String userId FK
    }
    Comment {
        String id PK
        String content
        Category type
        DateTime createdAt
        DateTime updatedAt
        String userId FK
        String productId FK
        String articleId FK
    }
    ProductLike {
        String id PK
        DateTime createdAt
        DateTime updatedAt
        String userId FK
        String productId FK
    }
    ArticleLike {
        String id PK
        DateTime createdAt
        DateTime updatedAt
        String userId FK
        String articleId FK
    }

```
