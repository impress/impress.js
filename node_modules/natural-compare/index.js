// Fork of https://github.com/litejs/natural-compare-lite
function naturalCompare(a, b) {
    var i, codeA, codeB = 1,
        posA = 0,
        posB = 0;

    function getCode(str, pos, code) {
        if (code != null) {
            for (i = pos; code = getCode(str, i), code < 76 && code > 65;) ++i;
            return +str.slice(pos - (str.charAt(pos - 2) == "-" ? 2 : 1), i);
        }
        return code > -1 ? code + 76 : ((code = str.charCodeAt(pos) || 0), code < 45 || code > 127) ? code
            : code < 46 ? 65               // -
            : code < 48 ? code - 1
            : code < 58 ? code + 18        // 0-9
            : code < 65 ? code - 11
            : code < 91 ? code + 11        // A-Z
            : code < 97 ? code - 37
            : code < 123 ? code + 5        // a-z
            : code - 63;
    }


    if ((a += "") != (b += "")) {
        for (; codeB;) {
            codeA = getCode(a, posA++);
            codeB = getCode(b, posB++);

            if (!i && codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
                codeA = getCode(a, posA, posA);
                codeB = getCode(b, posB, posA = i);
                posB = i;
            }
            i = codeA == 66 || codeB == 66;

            if (codeA != codeB) return (codeA < codeB) ? -1 : 1;
        }
    }
    return 0;
}





module.exports = naturalCompare;



