# 🎯 2026 BEM FISIP UNPAD - Sprint Checklist

*Note: As requested, the heavy copywriting pages (Sprint 2 & 2.1) can be deferred to the end of the development cycle while waiting for the copy to be finalized.*

---

## 🏃‍♂️ Sprint 1: Home Page (`/`)
*Focus: Setting up the main landing page and its dedicated Sanity schemas.*

### 🎨 Frontend Tasks
- [ ] Build **Hero Section** & **CTA**.
- [ ] Build **Brief About** section.
- [ ] Build **Mapres (Outstanding Students)** carousel/section.
- [ ] Build **Proker (Work Programs)** section.
- [ ] Build **PR / Press Release** section (Embedded IG layout).
- [ ] Build **Latest Articles & Kajian** preview section.

### 🗄️ Sanity CMS Tasks
- [ ] **Create `mapres` schema**: 
  - Fields: `title` (string), `image` (image), `url ig` (url).
- [ ] **Create `proker` schema**: 
  - Fields: `title` (string), `image` (image), `description` (text), `url ig` (url).

### 🔗 Integration
- [ ] Fetch and map `mapres` data to the frontend.
- [ ] Fetch and map `proker` data to the frontend.

---

## 🏃‍♂️ Sprint 2: About Page (`/about`) 
*Note: High copywriting requirement. Can be delayed to later sprints.*

### 🎨 Frontend & Hardcoded Data Tasks
- [ ] Build static **Setapak Mengawan / Hero Logo** section.
- [ ] Build static **Filosofi Logo** interactive section.
- [ ] Build **Visi, Misi, & Nilai** UI sections.
- [ ] 📝 *Data Task:* Create hardcoded JSON file for **Visi, Misi, & Nilai** (since it won't use Sanity).
- [ ] Build **Pimkab (Meet the Team)** section UI.
- [ ] Build **DepBir (Department & Bureau)** overview cards UI.

### 🗄️ Sanity CMS Tasks
- [ ] **Create `pimkab` schema** (Since Visi/Misi are JSON, Sanity is only needed for leadership here):
  - Fields: `name` (string), `role` (string), `image` (image).
- [ ] **Create `depbir` schema** (For the overview cards):
  - Fields: `name` (string), `coverImage` (image).

### 🔗 Integration
- [ ] Fetch and render `pimkab` data for the Meet the Team section.
- [ ] Load and render the local JSON data for Visi, Misi, and Nilai.

---

## 🏃‍♂️ Sprint 2.1: Department Details (`/about/[depbir]`)
*Focus: The dynamic pages for each specific department.*

### 🎨 Frontend Tasks
- [ ] Build dynamic route `src/app/about/[depbir]/page.tsx`.
- [ ] Build Department Header/Description UI.
- [ ] Build Member/Roster Grid UI.
- [ ] Handle 404 / Missing Route states.

### 🗄️ Sanity CMS Tasks
- [ ] **Create `anggota` schema**:
  - Fields: `name` (string), `image` (image), `department` (reference to `depbir`).

### 🔗 Integration
- [ ] Fetch specific `depbir` data based on the URL slug.
- [ ] Fetch all `anggota` (members) that reference the current department slug.

---

## 🏃‍♂️ Sprint 3: Artikel & Kajian (`/article` & `/post/[slug]`)
*Focus: The publication hub. Sanity is already complete.*

### 🎨 Frontend Tasks
- [ ] Build `/article` index page.
- [ ] Add pagination and category filters to index page.
- [ ] Build `/post/[slug]` detail page.
- [ ] Set up `PortableText` renderer to convert Sanity rich-text into React components.

### 🗄️ Sanity CMS Tasks
- [x] Schemas already complete/defined (Skipped).

### 🔗 Integration
- [ ] Fetch list of articles for the index page.
- [ ] Fetch specific article content by slug for the detail page.

---

## 🏃‍♂️ Sprint 4: Hima & Huria (`/hima`)
*Focus: The campus associations directory.*

### 🎨 Frontend Tasks
- [ ] Build the Hima/Huria grid layout.
- [ ] Ensure cards link properly to external Instagram URLs.

### 🗄️ Sanity CMS Tasks
- [ ] **Create `hima` schema**:
  - Fields: `title` (string), `image/logo` (image), `description` (text), `link ig` (url).

### 🔗 Integration
- [ ] Fetch and map all `hima` data to the frontend grid.
