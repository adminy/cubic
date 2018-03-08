
var colours = {
    //Foreground
    31 : 'Red',
    32 : 'Green',
    33 : 'Yellow',
    34 : 'Blue',
    35 : 'Magenta/Purple',
    36 : 'Cyan',
    37 : 'Light Gray',
    //Background
    40 : 'Black',
    41 : 'Red',
    42 : 'Green',
    43 : 'Yellow',
    44 : 'Blue',
    45 : 'Magenta/Purple',
    46 : 'Cyan',
    47 : 'Light Gray',
    49 : 'Default background color',
    //Foreground
    90 : 'Dark Gray',
    91 : 'Light Red',
    92 : 'Light Green',
    93 : 'Light Yellow',
    94 : 'Light Blue',
    95 : 'Light Magenta/Pink',
    96 : 'Light Cyan',
    97 : 'White',
    //Background
    100 : 'Dark Gray',
    101 : 'Light Red',
    102 : 'Light Green',
    103 : 'Light Yellow',
    104 : 'Light Blue',
    105 : 'Light Magenta/Pink',
    106 : 'Light Cyan',
    107 : 'White',  
}

//this function is great as we log every detail, helps us walk through development and that is how it should be, 
//however in `live release` the server will be running in background, so perhaps the logs should get stored in a file

function log(text, colour_id) {

    if(colour_id && colour_id in colours)
        console.log('\x1b['+colour_id+'m%s\x1b[0m', text)
    else
        console.log(text)
}

module.exports = log;