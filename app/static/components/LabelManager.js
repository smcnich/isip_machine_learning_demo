export class Label {
    constructor(labelName, color) {
        this.name = labelName;
        this.color = color;
        this.mapping = null;
    }

    setMapping(mapping) {
        this.mapping = mapping;
    }

    changeColor(color) {
        this.color = color;
    }
}

export class LabelManager {
    constructor() {
        this.labels = [];
        this.mappings = {};
    }

    getLabels() {
        return this.labels;
    }

    getLabel(labelName) {
        return this.labels.find((label) => {
            return label.name.toLowerCase() === labelName.toLowerCase();
        });
    }

    getMappings() {
        return this.mappings;
    }

    getColors() {
        const colors = [];
        
        this.labels.forEach((label) => {
            colors.push(label.color);
        });

        return colors;
    }

    getColorMappings() {

        const colorMappings = {};
        
        this.labels.forEach((label) => {
            colorMappings[label.name.toLowerCase()] = label.color;
        });

        return colorMappings;
    }

    setMappings(mappings) {

        // convert the keys of the mappings object to lowercase
        // and save it
        //
        this.mappings = Object.fromEntries(
            Object.entries(mappings).map(([key, value]) => [key.toLowerCase(), value])
        );

        // set the mapping for each label
        //
        this.labels.forEach((label) => {
            label.setMapping(this.mappings[label.name.toLowerCase()]);  
        });
    }

    addLabel(labelObj) {

        // get the lowercase version of the class name
        //
        const labelName = labelObj.name.toLowerCase();

        // check if the class name already exists
        //
        const labelExists = this.labels.some((label) => {
            return label.name.toLowerCase() === labelName;
        });

        // if the label exists then return false
        //
        if (labelExists) {
            return false;
        }

        // add the class to the list of classes
        //
        this.labels.push(labelObj);

        // return true to indicate that the class was added
        // 
        return true;
    }
    //
    // remove a class from the list of classes

    mapLabels(labels, mappings=this.mappings) {
        /*
        method: Plot::mapLabels

        args:
         labels (Array): the list of classes to map, can be arbitrary dimension
         mappings (Object): the mapping of classes to colors. keys are the 
                            class names, values are the numeric mappings

        returns:
         Array: the mapped classes in the same dimension as the input

        desciption:
         maps the classes to their numeric mappings. this is mainly used when
         converting z data in preparation for plotting a decision surface
        */

        // for each object in the labels array
        //
        return labels.map(item => {

            // if current item is an array
            //
            if (Array.isArray(item)) {

                // recursively map nested arrays
                //
                return this.mapLabels(item);
            } 
            
            // else, return the mapped value
            //
            else {
                return mappings[item.toLowerCase()];
            }
          });
          // this will create a new array with the mapped values
    }
    //
    // end of method

    remove_label(labelName) {
        /*
        method: Plot::remove_label

        args:
         labelName (String): the name of the class to remove

        returns:
         Boolean: true if the class was removed, false if it was not

        description:
         removes a class from the list of classes
        */

        // get the original length of the list of classes
        //
        const origLength = this.labels.length;

        // get the lowercase version of the class name
        //
        labelName = labelName.toLowerCase();

        // remove the classes that do not match the class name
        //
        this.labels = this.labels.filter((label) => {
            return label.name.toLowerCase() !== labelName.toLowerCase();
        });

        // if the length of the classes is less than the original length
        // then the class was removed
        // so return true
        //
        if (this.labels.length < origLength) {
            return true;
        }

        // else return false
        //
        return false;
    }
    //
    // end of method

    clear() {       
        /*
        method: Plot::clear

        args:
        None

        returns:
        None

        description:
         clears the list of classes
        */

        // clear the list of classes
        //
        this.labels = [];
    }
}