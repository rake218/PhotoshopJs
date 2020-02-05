// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 0;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

//=================================================================
// Globals
//=================================================================

// UI strings to be localized
var strTitle = localize("$$$/JavaScripts/LayerCompsToFiles/Title=Layer Comps To Files");
var strButtonRun = localize("$$$/JavaScripts/LayerCompsToFiles/Run=Run");
var strButtonCancel = localize("$$$/JavaScripts/LayerCompsToFiles/Cancel=Cancel");
var strHelpText = localize("$$$/JavaScripts/LayerCompsToFiles/Help=Please specify the format and location for saving each layer comp as a file.");
var strLabelDestination = localize("$$$/JavaScripts/LayerCompsToFiles/Destination=Destination:");
var strButtonBrowse = localize("$$$/JavaScripts/LayerCompsToFiles/Browse=&Browse...");
var strLabelFileNamePrefix = localize("$$$/JavaScripts/LayerCompsToFiles/FileNamePrefix=File Name Prefix:");
var strCheckboxSelectionOnly = localize("$$$/JavaScripts/LayerCompsToFiles/SelectedOnly=&Selected Layer Comps Only");
var strLabelFileType = localize("$$$/JavaScripts/LayerCompsToFiles/FileType=File Type:");
var strCheckboxIncludeICCProfile = localize("$$$/JavaScripts/LayerCompsToFiles/IncludeICC=&Include ICC Profile");
var strJPEGOptions = localize("$$$/JavaScripts/LayerCompsToFiles/JPEGOptions=JPEG Options:");
var strLabelQuality = localize("$$$/JavaScripts/LayerCompsToFiles/Quality=Quality:");
var strPSDOptions = localize("$$$/JavaScripts/LayerCompsToFiles/PSDOptions=PSD Options:");
var strCheckboxMaximizeCompatibility = localize("$$$/JavaScripts/LayerCompsToFiles/Maximize=&Maximize Compatibility");
var strTIFFOptions = localize("$$$/JavaScripts/LayerCompsToFiles/TIFFOptions=TIFF Options:");
var strLabelImageCompression = localize("$$$/JavaScripts/LayerCompsToFiles/ImageCompression=Image Compression:");
var strNone = localize("$$$/JavaScripts/LayerCompsToFiles/None=None");
var strPDFOptions = localize("$$$/JavaScripts/LayerCompsToFiles/PDFOptions=PDF Options:");
var strLabelEncoding = localize("$$$/JavaScripts/LayerCompsToFiles/Encoding=Encoding:");
var strTargaOptions = localize("$$$/JavaScripts/LayerCompsToFiles/TargaOptions=Targa Options:");
var strLabelDepth = localize("$$$/JavaScripts/LayerCompsToFiles/Depth=Depth:");
var strRadiobutton16bit = localize("$$$/JavaScripts/LayerCompsToFiles/Bit16=16bit");
var strRadiobutton24bit = localize("$$$/JavaScripts/LayerCompsToFiles/Bit24=24bit");
var strRadiobutton32bit = localize("$$$/JavaScripts/LayerCompsToFiles/Bit32=32bit");
var strBMPOptions = localize("$$$/JavaScripts/LayerCompsToFiles/BMPOptions=BMP Options:");
var strAlertSpecifyDestination = localize("$$$/JavaScripts/LayerCompsToFiles/SpecifyDestination=Please specify destination.");
var strAlertDestinationNotExist = localize("$$$/JavaScripts/LayerCompsToFiles/DestionationDoesNotExist=Destination does not exist.");
var strTitleSelectDestination = localize("$$$/JavaScripts/LayerCompsToFiles/SelectDestination=Select Destination");
var strAlertDocumentMustBeOpened = localize("$$$/JavaScripts/LayerCompsToFiles/OneDocument=You must have a document open to export!");
var strAlertNoLayerCompsFound = localize("$$$/JavaScripts/LayerCompsToFiles/NoComps=No layer comps found in document!");
var strAlertWasSuccessful = localize("$$$/JavaScripts/LayerCompsToFiles/Success= was successful.");
var strUnexpectedError = localize("$$$/JavaScripts/LayerCompsToFiles/Unexpectedd=Unexpected error");
var strMessage = localize("$$$/JavaScripts/LayerCompsToFiles/Message=Layer Comps To Files action settings");
var stretQuality = localize( "$$$/locale_specific/JavaScripts/LayerCompsToFiles/ETQualityLength=30" );
var stretDestination = localize( "$$$/locale_specific/JavaScripts/LayerCompsToFiles/ETDestinationLength=160" );
var strddFileType = localize( "$$$/locale_specific/JavaScripts/LayerCompsToFiles/DDFileType=100" );
var strpnlOptions = localize( "$$$/locale_specific/JavaScripts/LayerCompsToFiles/PNLOptions=100" );
var strCreateFolder = localize( "$$$/JavaScripts/LayerCompsToFiles/CreateFolder=The folder does not exist. Do you wish to create it?^r" );
var strCouldNotCreate = localize( "$$$/JavaScripts/LayerCompsToFiles/CouldNotCreate=The folder could not be created." );
var strPNG8Options = localize("$$$/JavaScripts/ExportLayersToFiles/PNG8Options=PNG-8 Options:");
var strCheckboxPNGTransparency = localize("$$$/JavaScripts/ExportLayersToFiles/Transparency=Transparency");
var strCheckboxPNGInterlaced = localize("$$$/JavaScripts/ExportLayersToFiles/Interlaced=Interlaced");
var strPNG24Options = localize("$$$/JavaScripts/ExportLayersToFiles/PNG24Options=PNG-24 Options:");

// the drop down list indexes for file type
var bmpIndex = 0; 
var jpegIndex = 1;
var pdfIndex = 2;
var psdIndex = 3;
var targaIndex = 4;
var tiffIndex = 5;
var png8Index = 6; 
var png24Index = 7;

// the drop down list indexes for tiff compression
var compNoneIndex = 0;
var compLZWIndex = 1;
var compZIPIndex = 2;
var compJPEGIndex = 3;


///////////////////////////////////////////////////////////////////////////////
// Dispatch
///////////////////////////////////////////////////////////////////////////////


main();



///////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Function: main
// Usage: the core routine for this script
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function main() {

    var exportInfo = new Object();
    initExportInfo(exportInfo);
    try {
        var docName = app.activeDocument.name;  // save the app.activeDocument name before duplicate.
        var compsName = new String("none");
        var compsCount = app.activeDocument.layerComps.length;
        if ( compsCount < 1 ) {
            if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                alert ( strAlertNoLayerCompsFound );
            }
	    	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
        } else {
            app.activeDocument = app.documents[docName];
            docRef = app.activeDocument;
    

            app.preferences.maximizeCompatibility = QueryStateType.ALWAYS ;
            for ( compsIndex = 0; compsIndex < compsCount; compsIndex++ ) {
                var compRef = docRef.layerComps[ compsIndex ];
                if (exportInfo.selectionOnly && !compRef.selected) continue; // selected only
                compRef.apply();
                var duppedDocument = app.activeDocument.duplicate();
                var fileNameBody = exportInfo.fileNamePrefix;
                fileNameBody += "_" + zeroSuppress(compsIndex, 4);
                fileNameBody += "_" + compRef.name;
                if (null != compRef.comment)    fileNameBody += "_" + compRef.comment;
                fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|\\\r\\\n]/g, "_");  // '/\:*?"<>|\r\n' -> '_'
                if (fileNameBody.length > 120) fileNameBody = fileNameBody.substring(0,120);
                saveFile(duppedDocument, fileNameBody, exportInfo);
                duppedDocument.close(SaveOptions.DONOTSAVECHANGES);
            }




            
            if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
                alert(strTitle + strAlertWasSuccessful);
            }

            app.playbackDisplayDialogs = DialogModes.ALL;

        }
    } 
    catch (e) {
        if ( DialogModes.NO != app.playbackDisplayDialogs ) {
            alert(e);
        }
    	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }

}


function initExportInfo(exportInfo)
{
    exportInfo.destination = new String("");
    exportInfo.fileNamePrefix = new String("untitled_");
    exportInfo.selectionOnly = false;
    exportInfo.fileType = psdIndex;
    exportInfo.icc = true;
    exportInfo.jpegQuality = 8;
    exportInfo.psdMaxComp = true;
    exportInfo.tiffCompression = TIFFEncoding.NONE;
    exportInfo.tiffJpegQuality = 8;
    exportInfo.pdfEncoding = PDFEncoding.JPEG;
    exportInfo.pdfJpegQuality = 8;
    exportInfo.targaDepth = TargaBitsPerPixels.TWENTYFOUR;
    exportInfo.bmpDepth = BMPDepthType.TWENTYFOUR;
    exportInfo.png24Transparency = true;
    exportInfo.png24Interlaced = false;
    exportInfo.png8Transparency = true;
    exportInfo.png8Interlaced = false;

    try {
        var tmp = app.activeDocument.fullName.name;
        exportInfo.fileNamePrefix = decodeURI(tmp.substring(0, tmp.indexOf("."))); // filename body part
        exportInfo.destination = Folder(app.activeDocument.fullName.parent).fsName+"/" + exportInfo.fileNamePrefix; // destination folder
        var myNewFolder = new Folder(exportInfo.destination + "/" + exportInfo.fileNamePrefix);
        myNewFolder.create();

    } catch(someError) {
        exportInfo.destination = new String("");
        exportInfo.fileNamePrefix = app.activeDocument.name; // filename body part
    }
}

function saveFile( docRef, fileNameBody, exportInfo)
{
    var isS4W = false,
        fileExtension;
        exportInfo.fileType = png24Index;
	if ( true /* folderExists(exportInfo.destination)*/) {
		switch (exportInfo.fileType) {

            case png24Index:
                fileExtension "png24";
                if(exportInfo.png24Transparency) {
                    fileExtension = "png32"
                }
                isS4W = true;
				var id6 = charIDToTypeID( "Expr" );
				var desc3 = new ActionDescriptor();
				var id7 = charIDToTypeID( "Usng" );
				var desc4 = new ActionDescriptor();
				var id8 = charIDToTypeID( "Op  " );
				var id9 = charIDToTypeID( "SWOp" );
				var id10 = charIDToTypeID( "OpSa" );
				desc4.putEnumerated( id8, id9, id10 );
				var id11 = charIDToTypeID( "Fmt " );
				var id12 = charIDToTypeID( "IRFm" );
				var id13 = charIDToTypeID( "PN24" );
				desc4.putEnumerated( id11, id12, id13 );
				var id14 = charIDToTypeID( "Intr" );
				desc4.putBoolean( id14, exportInfo.png24Interlaced );
				var id15 = charIDToTypeID( "Trns" );
				desc4.putBoolean( id15, exportInfo.png24Transparency );
				var id16 = charIDToTypeID( "Mtt " );
				desc4.putBoolean( id16, true );
				var id17 = charIDToTypeID( "MttR" );
				desc4.putInteger( id17, 255 );
				var id18 = charIDToTypeID( "MttG" );
				desc4.putInteger( id18, 255 );
				var id19 = charIDToTypeID( "MttB" );
				desc4.putInteger( id19, 255 );
				var id20 = charIDToTypeID( "SHTM" );
				desc4.putBoolean( id20, false );
				var id21 = charIDToTypeID( "SImg" );
				desc4.putBoolean( id21, true );
				var id22 = charIDToTypeID( "SSSO" );
				desc4.putBoolean( id22, false );
				var id23 = charIDToTypeID( "SSLt" );
				var list1 = new ActionList();
				desc4.putList( id23, list1 );
				var id24 = charIDToTypeID( "DIDr" );
				desc4.putBoolean( id24, false );
				var id25 = charIDToTypeID( "In  " );
				desc4.putPath( id25, new File( exportInfo.destination + "/" + fileNameBody + ".png") );
				var id26 = stringIDToTypeID( "SaveForWeb" );
				desc3.putObject( id7, id26, desc4 );
                executeAction( id6, desc3, DialogModes.NO );
                alert("saving done");
				break;
			default:
				if ( DialogModes.NO != app.playbackDisplayDialogs ) {
					alert(strUnexpectedError);
				}
				break;
		}
	}

}
function zeroSuppress (num, digit)
{
    var tmp = num.toString();
    while (tmp.length < digit) {
		tmp = "0" + tmp;
	}
    return tmp;
}