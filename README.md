# Clique-WebFront-Personnal

This is fontend of CuEventHub project (Working Title)

Before launch please enter the following command

```
npm install
npm start
```

## Things to do

* Add facebook login
    * Either from server or directly from facebook (Using Javascript SDK)
* Add event detail pages
* Add channel detail pages
* Add search result
* Add user login
* Add user profile
* Add axios request with header for credential info
    * Looking into [this video](https://www.youtube.com/watch?v=vALIhhrMct8)

## How to use higher order component
1. Import the modules
    * For pages use pages modules, located in `/src/hoc/pages`
    * For binding to component use modules, located in `/src/hoc/autoBind`

2. There are 4 arguments for using hoc
     1. **Composed component** a component to be composed e.g.
    ```
    import autoBind from '../hoc/autoBind';
    ...
    ```
        export default autoBind(Component);
     2. **isBindWithRequests** is a boolean value if the component need to bind with request or not (Default is false)
     3.  **actionsAdded** is an array of String contain name of actions to be added, only works if *isBindWithRequests* is set to false
     4. **stateAdded** is an array of String contain name of store property to be added, only works if *isBindWithRequests* is set to false
        ### For Example
        ```javascript
        import autoBind from '../hoc/autoBind';
        ...
        export default autoBind(Component, false, ["getEvent"], ["a_getEventObj"]);
        ```
        **Note** the full name list of actions is the name of exported function in `/src/actions/index`. Full name list of states can be found in `/src/reducers/index`. It is the property of *rootReducer* object.

        #### For example

        ```javascript
        {
            pages: pagesReducer,
            a_getChannelObj: reducer_get_channel,
            ...
        }
        ```
        *a_getChannelObj* will be the string put in arrays in the fourth agrument.

## Note
1. All style css should be edit in scss file (If using atom, recommend using 'sass-autocompile' package)
2. If you don't want to edit main scss file directly. You can created another css file and import it directly to your file.

	### For example.
    ```
    import './something.css';
    ...
    ```
	Tis is valid. But please know that in the end all of the css file will be compiled into a single file. So if you want to import your own css file. I recommend creating another class as a container.
	### Format
    ```javascript
    import './something.css'; //Auto generate
    ...
    render() {
	    return (
		    <section className="your-class-name-container">
			    ...
		    </section>
		);
	}
    ```
    In scss file
    ```scss
    section.your-class-name-container {
	    .your-sub-class-name {
		    ...
	    }
	    ...
	}
    ```
	### For Example
	```javascript
    import './something.css'; //Auto generate
    ...
    render() {
	    return (
		    <section className="test-page-container">
			    <div className="test-sub-1">Test</div>
			    <div className="test-sub-2">Test</div>
		    </section>
		);
	}
    ```
    In scss file
    ```scss
    section.test-page-container {
	    .test-sub-1{
		    ...
	    }
	    .test-sub-2 {
		    ...
	    }
	}
    ```
3. Try not to change app.js anymore. Current version is using `react-router` to navigate. So each page is now its own component and it can be accessed by using the url. But I think it is okay for testing. Just change the component in IndexRoute to your page.
4. Changing version of `react-router` from `2.0.0-rc5` to `2.5.2` to avoid `React.PropTypes` is deprecated warning.
5. Please use `SASS`. Don't modified the css file directly.
