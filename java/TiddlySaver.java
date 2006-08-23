import java.io.*;

public class TiddlySaver extends java.applet.Applet {
  public String loadFile(String filename) {
	try {
	  StringBuffer data = new StringBuffer();
	  BufferedReader r = new BufferedReader(new FileReader(filename));
	  String line;
	  while ((line = r.readLine()) != null) data.append(line).append("\n");
	  r.close();
	  return data.toString();
	} catch (Exception x) {
	  x.printStackTrace();
	  return null;
	}
  }
  public int saveFile(String filename, String data) {
	try {
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
	} catch (Exception x) {
	  x.printStackTrace();
	  return 0;
	}
  }
}
