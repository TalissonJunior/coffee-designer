![Build Status](https://travis-ci.org/TalissonJunior/coffee-designer.svg?branch=master)
# Coffee Designer


An visual tool created for coffee

![Example](https://raw.githubusercontent.com/TalissonJunior/coffee-designer/master/.github/example.jpg)

### Prerequisites

Node.js 
 
>[Node.js](https://nodejs.org/), recomended to download any stable version above 12.13.0


### Usage in production

Import the output build files located inside './dist/' folder
```html
<link rel="stylesheet" href="./dist/CoffeeDesigner.min.css">
<script src="./dist/CoffeeDesigner.min.js"></script>
```

Example
```html
<script>
    // Initializing Coffee Designer
    const coffeeDesigner = CoffeeDesigner.init({
        projectName: 'My Project'
    });

    // Here we are using a mock json, but you can fetch from an api
    // Just make sure the json comes formatted;
    const json = {
        data: {
            classTables: [
                {
                    name: "User",
                    tableName: "t_user",
                    properties: [
                        {
                            name: "id",
                            columnName: "id",
                            description: "",
                            type: "Guid",
                            isForeignKey: false,
                            isPrimaryKey: true,
                            isRequired: true,
                            hasChangeMethod: true
                        },
                        {
                            name: "Name",
                            columnName: "Name",
                            description: "",
                            type: "string",
                            isForeignKey: false,
                            isPrimaryKey: false,
                            isRequired: true,
                            hasChangeMethod: true
                        },
                         {
                            name: "FkAddressId",
                            columnName: "fk_address_id",
                            description: "",
                            type: 'Guid',
                            isForeignKey: true,
                            isPrimaryKey: false,
                            isRequired: true,
                            hasChangeMethod: true,
                            foreign: {
                                table: 'Address',
                                tableColumn: 'id',
                                classProperty: 'Address'
                            }
                        }
                    ],
                    position: {
                        x: 138,
                        y: 98
                    }
                },
                {
                    name: "Address",
                    tableName: "t_address",
                    properties: [
                        {
                            name: "Id",
                            columnName: "id",
                            description: "",
                            type: "Guid",
                            isForeignKey: false,
                            isPrimaryKey: false,
                            isRequired: true,
                            hasChangeMethod: true
                        }
                    ],
                    position: {
                        x: 137,
                        y: 291
                    }
                }
            ]
        }
    }

    // Tells CoffeeDesigner to build ClassTables from json
    coffeeDesigner.fromJson(json);

    // Export all as json
    const outputJson = coffeeDesigner.toJson();
    
 </script>
```

#### ON Change Listenners
List of available listenners 

| Value        | Description   | CallbackParams         
| ------------- | -------------| -------------
| ``change``      | Listen to any changes | (classTable) 
| ``delete``    | Emitted when the class/table is deleted  | (classTable)
| ``change:name``    | Emitted when the class/table name changes | (classTable)
| ``change:property``    | Emitted when the class/table properties changes | (classTable)
| ``change:position``    | Emitted when the class/table position change | (classTable)

Usage:

```html
<script>
    const coffeeDesigner = CoffeeDesigner.init('body');

    // Listen to one change at time
    coffeeDesigner.on('change', (callbackParams) => {});

    // Listen to multiple changes at time
    coffeeDesigner.on(['change:name', 'change:property'], (callbackParams) => {});
</script>
```
### Development.


To serve the application and watch for changes type. 
```sh
npm run serve
```
it will open a browser running a server on http://localhost:3000/

To build type

```sh
npm run build
```