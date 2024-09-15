WEB COMPONENT TEMPLATE

    This folder contains a template for a web component. A web
    component is a reusable and encpapsulated part of web
    application. Think of a web component as a function for a
    front-end function. An example of this would be to make
    a web component for the plots in IMLD, since there are
    two of them and they can bbe reused.

    We want to use web comonenents for this project because
    they will simplify and clean up the development of the
    applications frontend. Frontend projects using HTML and CSS
    can quickly become a burden and difficult to manage due to
    long file sizes. Web components will encapsulate specific
    parts of the GUI into their own HTML, CS, and JS files,
    making it easier to focus on developing specific features.

HOW TO USE:

    1. Make a copy of the Template.js file
        - You will make your web component using the template file.

    2. Change the file name to the name of your component
        - For code standards, please have your component start with
          an uppercase letter.

    3. Change the name of the class in the JavaScript file
        - Make sure the class name matches the file names exactly.

    4. Change the custom element name at the end of the JS file.
        - Give your web component a custom name to be used in
          HTML files.
    
    5. Write the HTML and CSS for the component
        - Inside of the render method, write your HTML and CSS

    6. Write JS scripting for the component (Optional)
        - Add methods and scripting to the component's JS file
          if needed.

    7. Import the component in the HTML file you want to use it in
        - From the HTML file you want to use the custom element in,
          include the component's JS 
        - '<script src="Component.js"></script>'

    8. Use the custom HTML tag
        - From the HTML file you want to use the custom component in,
          call the component using the component name you defined
          in the JS file.