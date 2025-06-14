## 🔥 Using Rspack with Express: Why You Need `webpack-dev-middleware` & `webpack-hot-middleware`

Rspack has **built-in Hot Module Replacement (HMR)** support — but only when using its **built-in
dev server (`rspack-cli`)**.

When building a **custom development server with Express**, Rspack **does not handle HMR
automatically**. You must manually wire up the middleware to:

- Serve files from memory
- Watch for changes
- Push hot updates to the client

### ✅ Solution

Use the standard Webpack middleware packages:

```bash
pnpm add --save-dev webpack-dev-middleware webpack-hot-middleware
```

### 🧩 Why This Works

Rspack is compatible with Webpack's plugin/middleware APIs, so these official Webpack middlewares
integrate cleanly. As of Rspack v0.7+, this is the **recommended way** to set up HMR in custom
server environments.

---

### ⚠️ Deprecated

The previously used Rspack-specific packages:

- `@rspack/dev-middleware`
- `@rspack/hot-middleware`

are now **deprecated** in favor of the standard Webpack equivalents.
