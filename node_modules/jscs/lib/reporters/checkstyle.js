function escapeAttrValue(attrValue) {
    return String(attrValue)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

module.exports = function(errorCollection) {
    console.log('<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="4.3">');
    errorCollection.forEach(function(errors) {
        console.log('    <file name="' + escapeAttrValue(errors.getFilename()) + '">');
        errors.getErrorList().forEach(function(error) {
            console.log(
                '        <error ' +
                'line="' + error.line + '" ' +
                'column="' + (error.column + 1) + '" ' +
                'severity="error" ' +
                'message="' + escapeAttrValue(error.message) + '" ' +
                'source="jscs" />'
            );
        });
        console.log('    </file>');
    });
    console.log('</checkstyle>');
};
