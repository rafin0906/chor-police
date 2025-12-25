# 🧱 Professional Mongoose Schema Design Guide (MERN Stack)

A practical, industry-level Mongoose schema design guide for MERN stack developers.

---

## 1️⃣ Core Schema Types (Most Used)

`String`, `Number`, `Boolean`, `Date`, `Buffer`, `ObjectId`, `Array`, `Map`, `Mixed`, `Decimal128`

### When to Use

| Type | Use Case |
|------|----------|
| `String` | Short text |
| `Number` | Counts, ratings |
| `Decimal128` | Money |
| `Date` | Timestamps |
| `ObjectId` | References |
| `Array` | Lists |
| `Map` | Key-value metadata |
| `Mixed` | Flexible (avoid if possible) |

---

## 2️⃣ Required, Default, Unique, Index

```javascript
title: {
  type: String,
  required: true,
  unique: true,
  index: true,
  default: "N/A"
}
```

---

## 3️⃣ Length & Word Limits

```javascript
title: {
  type: String,
  minlength: 5,
  maxlength: 100,
  trim: true
}
```

---

## 4️⃣ Case Control (Upper / Lower)

```javascript
title: {
  type: String,
  lowercase: true,
  uppercase: false,
  trim: true
}
```

---

## 5️⃣ Enum / Controlled Values

```javascript
level: {
  type: String,
  enum: ["beginner", "intermediate", "advanced"],
  required: true
}
```

---

## 6️⃣ Validation (Industry Standard)

### Custom Validation
```javascript
price: {
  type: mongoose.Schema.Types.Decimal128,
  validate: {
    validator: v => v >= 0,
    message: "Price must be positive"
  }
}
```

### Regex Validation (Email Example)
```javascript
email: {
  type: String,
  match: [/^\S+@\S+\.\S+$/, "Invalid email"]
}
```

---

## 7️⃣ Relationships (References)

```javascript
instructor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

**Usage:**
```javascript
Course.find().populate("instructor")
```

---

## 8️⃣ Embedded Documents (When Needed)

```javascript
reviews: [{
  rating: Number,
  comment: String
}]
```

---

## 9️⃣ Soft Delete (Production MUST)

```javascript
isDeleted: {
  type: Boolean,
  default: false
},
deletedAt: {
  type: Date
}
```

---

## 🔟 Timestamps (Auto)

```javascript
const courseSchema = new mongoose.Schema(
  { /* fields */ },
  { timestamps: true }
)
```

Creates:
- `createdAt`
- `updatedAt`

---

## 1️⃣1️⃣ Indexes (Performance)

```javascript
courseSchema.index({ title: 1 })
courseSchema.index({ price: 1, level: 1 })
```

---

## 1️⃣2️⃣ Virtual Fields (Computed)

```javascript
courseSchema.virtual("discountedPrice").get(function () {
  return this.price * 0.9
})
```

---

## 1️⃣3️⃣ Middleware (Hooks)

### Pre-save (Normalization)
```javascript
courseSchema.pre("save", function (next) {
  this.title = this.title.trim().toLowerCase()
  next()
})
```

### Pre-delete
```javascript
courseSchema.pre("findOneAndDelete", function () {
  console.log("Course deleted")
})
```

---

## 1️⃣4️⃣ User-defined Tools & Functions

### Project Structure
```
project/
│
├── models/
│   ├── course.js
│   ├── user.js
│   └── utils.js
│
├── controllers/
├── routes/
└── app.js
```

### utils.js – Custom Tools
```javascript
// utils.js
module.exports = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  normalizePrice: (price) => parseFloat(price.toFixed(2)),
  validateEmail: (email) => /^\S+@\S+\.\S+$/.test(email)
};
```

### Instance Methods
```javascript
// Capitalize title before saving
courseSchema.methods.formatTitle = function () {
  this.title = capitalize(this.title);
};
```

### Static Methods
```javascript
// Get all active courses
courseSchema.statics.getActiveCourses = function () {
  return this.find({ isDeleted: false, isActive: true });
};
```

### Middleware with Custom Functions
```javascript
const { capitalize, normalizePrice } = require("./utils");

// Pre-save hook: normalize price and format title
courseSchema.pre("save", function (next) {
  this.formatTitle();
  this.price = normalizePrice(parseFloat(this.price));
  next();
});
```

---

## 1️⃣5️⃣ Full Professional Example

```javascript
const mongoose = require("mongoose");
const { capitalize, normalizePrice } = require("./utils");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
    index: true
  },

  description: {
    type: String,
    default: "N/A"
  },

  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: 0
  },

  duration: {
    type: Number // minutes
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Instance method
courseSchema.methods.formatTitle = function () {
  this.title = capitalize(this.title);
};

// Static method
courseSchema.statics.getActiveCourses = function () {
  return this.find({ isDeleted: false, isActive: true });
};

// Pre-save hook
courseSchema.pre("save", function (next) {
  this.formatTitle();
  this.price = normalizePrice(parseFloat(this.price));
  next();
});

// Virtual field
courseSchema.virtual("priceWithTax").get(function () {
  return normalizePrice(parseFloat(this.price) * 1.1); // 10% tax
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
```

### Usage in Controller
```javascript
const Course = require("../models/course");

// Create course
async function createCourse(data) {
  const course = new Course(data);
  await course.save();
  console.log(course.priceWithTax); // using virtual
}

// Fetch active courses using static method
const activeCourses = await Course.getActiveCourses();
```

---

## 1️⃣6️⃣ What Makes It "Industry Level"

✅ Strong validation  
✅ Indexes  
✅ Soft delete  
✅ Controlled enums  
✅ Proper money type  
✅ Hooks for normalization  
✅ No uncontrolled Mixed  
✅ Clean relationships  
✅ Custom methods & statics  
✅ Reusable utility functions  

---

## SQLAlchemy vs Mongoose (Mental Mapping)

| SQLAlchemy | Mongoose |
|------------|----------|
| `Column` | Field |
| `Enum` | `enum` |
| `CheckConstraint` | `validate` |
| `@validates` | `pre` / `validate` |
| `relationship` | `ref` + `populate` |
| `server_default` | `default` |
| soft delete | `isDeleted` |

---

## TL;DR (MERN Dev Must-Know)

- Schema types
- `required`, `default`, `unique`, `index`
- `minlength`, `maxlength`, `enum`
- Regex validation
- Hooks (`pre`, `post`)
- Soft delete
- `Decimal128` for money
- Instance & static methods
- Custom utility functions
- Virtuals for computed fields

---

## 📚 Next Topics

- SQLAlchemy ↔ Mongoose side-by-side mapping
- MongoDB schema design rules
- Performance indexing strategy
- When to embed vs reference
- Advanced validation patterns