# Project Documents

## Naming components/files

1. **Compoments**: always use camel case (CamelCase)
   Example: `Button` in `Home` folder is `HomeButton.tsx`
2. **Layouts**: always use camel case (CamelCase)
   Example: `DasboardLayout.tsx` or `MainLayout.tsx`
3. **Contexts**: always use camel case (CamelCase)
   Example: `UserContext.tsx` or `AuthContext.tsx`
4. **Custom Hooks**: always start with `use<hookName>`
   Example: `useUserContext.ts`
5. **Utitlies**:

- If the file is not in the `utils` folder - parent folder, name like this:

```
- utils
|__format-date.ts
|__format-time.ts
|__lodash
    |__lodash-bind.ts
    |__lodash-copy.ts
```

6. **Props/Types/Interfaces**: always add `Props` at the end of the component
   Example: `AuthSignIn.ts` or `AuthSignUp` for files and `AuthProps` for variables

## Gitflow

- 5 branches with 5 purposes:

1. `main` branch for production.
2. `dev` branch for development, checkout from `main` branch, merge to `main` only.
3. `feature/<your_task>` branch for developing features of the project, checkout from `dev` branch, merge to `dev` only.
4. `ui/<your_task>` branch for implement interfaces of the project, checkout from `dev` branch, merge to `dev` only.
5. `update/<your_task>` branch for updating features of the project, checkout out from `dev` branch, merge to `dev` only.
6. `fix/<your_task>`, branch for quick fixing feature during the production, checkout from `main` branch, merge to `dev` and `main` branch.

- How to write commit: `"<your_name> | <commit_content>"`

## Recommend to read these articles:

1. [Tree shaking](https://nkthanh.dev/posts/tree-shaking)
2. [Shadcn](https://ui.shadcn.com/docs)
3. [Framer Motion](https://www.framer.com/motion/introduction/)
