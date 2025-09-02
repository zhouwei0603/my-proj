# vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

# Data generator

- Check the safe update configuration
``` sql
SHOW VARIABLES LIKE 'SQL_SAFE_UPDATES';
```
- Change safe update configuration
``` sql
SET SQL_SAFE_UPDATES = 0;
```
- Run command
``` sh
python3 po_creator.py
python3 part_creator.py
```
- Create launch.json
``` json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python Debugger: PO data generator script",
            "type": "debugpy",
            "request": "launch",
            "program": "C:\\Users\\周巍\\repos\\my-proj\\src\\data.utils\\datagen\\po_creator.py",
            "console": "integratedTerminal"
        },
        {
            "name": "Python Debugger: Part data generator script",
            "type": "debugpy",
            "request": "launch",
            "program": "C:\\Users\\周巍\\repos\\my-proj\\src\\data.utils\\datagen\\part_creator.py",
            "console": "integratedTerminal"
        }
    ]
}
```
