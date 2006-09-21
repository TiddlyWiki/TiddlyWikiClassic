import java.io.*;

public class TiddlySaver extends java.applet.Applet {
  public String loadFile(String filename, String charset) {
    try {
      if (charset.length() == 0) {
        StringBuffer data = new StringBuffer();
        BufferedReader r = new BufferedReader(new FileReader(filename));
        String line;
        while ((line = r.readLine()) != null) data.append(line).append("\n");
        r.close();
        return data.toString();
      } else {
        File f = new File(filename);
        FileInputStream i = new FileInputStream(f);
        byte[] b = new byte[(f.length() > Integer.MAX_VALUE) ? Integer.MAX_VALUE : (int)f.length()];
        int offset = 0;
        int num = 0;
        while (offset < b.length && (num = i.read(b, offset, b.length - offset)) >= 0) {
          offset += num;
        }
        i.close();
        return new String(b, 0, offset, charset);
      }
    } catch (Exception x) {
      x.printStackTrace();
      return null;
    }
  }
  public int saveFile(String filename, String charset, String data) {
    try {
      if (charset.length() == 0) {
        int e, s = 0;
        BufferedWriter w = new BufferedWriter(new FileWriter(filename));
        do {
          e = data.indexOf('\n', s);
          if (e == -1) e = data.length();
          w.write(data, s, e - s);
          w.newLine();
          s = e + 1;
        } while (s < data.length());
        w.close();
        return 1;
      } else {
        FileOutputStream o = new FileOutputStream(filename);
        o.write(data.getBytes(charset));
        o.close();
        return 1;
      }
    } catch (Exception x) {
      x.printStackTrace();
      return 0;
    }
  }
}
