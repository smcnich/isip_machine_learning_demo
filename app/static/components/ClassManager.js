export class Label {
    constructor(labelName, color) {
        this.name = labelName;
        this.color = color;
    }

    changeColor(color) {
        this.color = color;
    }
}

export class LabelManager {
    constructor() {
        this.labels = [];
    }

    getLabels() {
        return this.labels;
    }

    addLabel(labelObj) {

        // get the lowercase version of the class name
        //
        const labelName = labelObj.name.toLowerCase();

        // check if the class name already exists
        // return true of it does
        //
        this.labels.forEach((label) => {
            if (label.className === labelName) {
                return false;
            }
        });

        // add the class to the list of classes
        //
        this.labels.push(labelObj);

        // return true to indicate that the class was added
        // 
        return true;
    }
    //
    // remove a class from the list of classes

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
}