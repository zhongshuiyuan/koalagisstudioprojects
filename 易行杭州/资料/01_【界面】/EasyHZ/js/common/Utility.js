function include(src, type) {
    var HTMLCode = '';
    if (!type) type = 'js';
    switch (type) {
        case 'js':
            HTMLCode = '<script language="javascript" type="text/javascript" src="' + src + '"></script>';
            break;
        case 'css':
            HTMLCode = '<link type="text/css" href="' + src + '"  rel="Stylesheet"/>';
            break;
    }
    document.write(HTMLCode);
}