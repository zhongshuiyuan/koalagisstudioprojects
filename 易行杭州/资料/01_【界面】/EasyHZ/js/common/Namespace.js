/**
 * Function:����һ��ȫ�ֶ���Namespace������ע�������ռ�
 * Author��������
 */
Namespace = new Object();

/**
 * ȫ�ֶ����������register����������Ϊ���ƿռ�ȫ·������"EasyHZ.Util"
 */
Namespace.register = function (fullNS) {
    // �������ռ��г�N����, ����EasyHZ��Util��
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        // ���δ������������ռ���󣨼��粻���ڵĻ��������
        // �����ȴ���EasyHZ��Ȼ�󴴽�EasyHZ.Util��������ȥ
        sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();";
    }
    if (sEval != "") eval(sEval);
}

//ע��KoalaGIS.EASYHZ
Namespace.register("KoalaGIS.EASYHZ");
 