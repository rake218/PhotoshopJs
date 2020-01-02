var Imgpath = "D:/tutorials 48gb/Photoshop_Scriptinh/JS_examples/01012020/newPng/";


function hideAllLayers(doc)
{
    //Hide all the layers
    for(var j=0; j<doc.layers.length; j++)
    {
        doc.layers[j].visible = false;
    }
}

var doc = app.activeDocument;
hideAllLayers(doc);

for(var i=0; i < doc.layers.length; i++)
{
    var layerIndex = doc.layers.length - 1 - i;
    doc.layers[layerIndex].visible = true;
    var saveOptions = new ExportOptionsSaveForWeb();
    saveOptions.format = SaveDocumentType.PNG;
    saveOptions.PNG8 = false;
    var newImgpath = Imgpath + doc.layers[layerIndex].name + ".png";
    var saveFile = File(newImgpath);
    alert(saveFile);
    app.activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, saveOptions);
    doc.layers[layerIndex].visible = false;
}

