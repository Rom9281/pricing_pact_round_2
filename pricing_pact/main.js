// Romain GAUD
// CPE Lyon
// Code for the exam.

// Imported libraries
// ------------------------------------------
const request = require('request');
fs = require('fs');
const node_html_parser = require('node-html-parser');

// Global Variables
// -----------------------------------------
let filename = 'website_data.txt';
let encoding = 'UFT-8';

const articles_list = new Map(); // Map using the number of the article logged in to acces the instance of object article containing the information
let temp = null; // temporary class variable
let i = 0; // Array iterator

// PRODUCT : 
// class constaining the information on each articles (specified in the email)
// Each article is logged in a map(see @articles_list) with the key being it's order
// Could be changed to id...

class Article{
  constructor(){
    this.author = "";
    this.id = "";
    this.description = "";
    this.dates = "";
  }
}

// Options from https://www.npmjs.com/package/node-html-parser
let options = {
  lowerCaseTagName: false,  // convert tag name to lower case (hurts performance heavily)
  comment: false,            // retrieve comments (hurts performance slightly)
  blockTextElements: {
    script: true,	// keep text content when parsing
    noscript: true,	// keep text content when parsing
    style: true,		// keep text content when parsing
    pre: true			// keep text content when parsing
  }
}

// MAIN
// -----------------------------------------------------------------------------------------

// I. Request the information on the website
// -------------------------------------------
request('https://medium.com/search?q=pricing', function (error, response, body) {
  //console.log('body:', body); // Print what has been recieved
  console.log("[$] Connection status: \n")
  console.error(' - error:', error); // Detect any errors
  console.log(' - statusCode:', response && response.statusCode); // read out the status
  console.log("\n");

  // II. parsing the data
  // --------------------------------------------
  if(node_html_parser.valid(body,[options])){  // verifies if the data is valid
    
    fs.writeFile(filename, body, [encoding], function(err){ // write the copy of the data in a file
      if (err) return console.log(err); // if error write in the console
    });
    
    console.log("[$] Data format is valid\n");
    const root = node_html_parser.parse(body,[options]); // use the parser to get to the information

    // Get the information specific to each author and 
    while(root.querySelector(".u-accentColor--textDarken") != null){ // While there is is still authors to extract
      i++; // new article
      temp = new Article(); // creates an instance of Article

      // ID and author name

      temp.author = root.querySelector(".u-accentColor--textDarken").textContent // get the text content of the class specified
      temp.id = root.querySelector(".u-accentColor--textDarken").getAttribute("data-action-value") // get the text content of the class specified

      console.log("[$] New article id : ",root.querySelector(".u-accentColor--textDarken").getAttribute("data-action-value")); 
      console.log("[$] New author written : ",root.querySelector(".u-accentColor--textDarken").textContent); 

      root.querySelector(".u-accentColor--textDarken").remove(); // removes the selection to go to the next and eventually stop the process

      // Description

      temp.description = root.querySelector(".graf--title").textContent; // same

      console.log("[$] New description written : ",root.querySelector(".graf--title").textContent); // same

      root.querySelector(".graf--title").remove(); // removes the selection to go to the next and eventually stop the process

      // Date

      temp.dates = root.querySelector(".js-postMetaInlineSupplemental").firstChild.firstChild.textContent; // same

      console.log("[$] New date written : ",root.querySelector(".js-postMetaInlineSupplemental").firstChild.firstChild.textContent); // same

      root.querySelector(".js-postMetaInlineSupplemental").remove(); // removes the selection to go to the next and eventually stop the process


      console.log("\n");
      articles_list.set(i,temp); // adds the instance with the informations
    }

    // Test product
    // ----------------------------------------
    console.log("TEST : description of the first article : ",articles_list.get(1).description); // testing the map created
  }
});



