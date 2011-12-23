
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.security.PrivilegedActionException;
import java.security.PrivilegedExceptionAction;


/**
 * 
 * TiddlySaver Applet
 * 
 * Debugging this is a real joy, especially getting at the text of exceptions
 * that are written/logged/whatever. So we don't do anything with exceptions but
 * pass them to the Javascript.  We are more flexible there.
 * 
 * This means all errors are communicated as exceptions, otherwise 
 * the javascript code has to handle exceptions and check for error return
 * values.
 *
 * The one exception is saveFile.  It also returns 1 on success, so
 * old code will still work.
 * 
 */
public class TiddlySaver extends java.applet.Applet {

    /**
     * Load a file and return the content.
     *
     * @param filename
     * @param charset
     * @return
     */
    public String loadFile(final String filename, final String charset) throws PrivilegedActionException, IOException {
        StringBuilder sb = new StringBuilder();
        FileInputStream in = privInputStream(filename);
        try {
            InputStreamReader reader =
                    isNullOrEmpty(charset) ?
                        new InputStreamReader(in) :
                        new InputStreamReader(in, charset);
            try {
                final char[] buff = new char[4096];
                for(;;) {
                    int len = reader.read(buff);
                    if(len < 0)
                        break;
                    sb.append(buff, 0, len);
                }
                return sb.toString();
            } finally {
                reader.close();
            }
        } finally {
            in.close();
        }
    }


    /**
     * Store the file.
     *
     * For backwards compatibility, this always returns 1.
     * If an error occurs, an exception is thrown however!
     *
     * @param filename
     * @param charset
     * @param data
     * @return
     */
    public int saveFile(final String filename, final String charset, final String data) throws PrivilegedActionException, IOException {
        OutputStream out = privOutputStream(filename);
        try {
            OutputStreamWriter writer = isNullOrEmpty(charset) ?
                new OutputStreamWriter(out) :
                new OutputStreamWriter(out, charset);
            try {
                writer.write(data);
            } finally {
                writer.close();
            }
        } finally {
            out.close();
        }
        return 1;
    }


    /**
     *
     * Check for file existence.
     *
     * @param filename
     * @return
     */
    public boolean exists(final String filename) {
        return privExists(filename);
    }

    /**
     *
     * Get a files modification time in milliseconds since the epoch.
     *
     * @param filename
     * @return
     */
    public long modificationTime(final String filename) throws IOException {
        long millis = privModificationTime(filename);
        if(millis == 0L) {
            throw new IOException("Unable to get file modification time: " + filename);
        }
        return millis;
    }

    /**
     *
     * Get the files in a directory.
     *
     * @param dirname
     * @return
     */
    public String[] listFiles(final String dirname) throws IOException {
        String[] filenames = privList(dirname);
        if(filenames == null) {
            throw new IOException("Not a directory:" + dirname);
        }
        return filenames;
    }


    public static boolean isNullOrEmpty(String s) {
        return s == null || "".equals(s.trim());
    }

    private static FileInputStream privInputStream(final String filename) throws PrivilegedActionException {
        return AccessController.doPrivileged(new PrivilegedExceptionAction<FileInputStream>() {
            public FileInputStream run() throws Exception {
                return new FileInputStream(filename);
            }
        });
    }

    private static FileOutputStream privOutputStream(final String filename) throws PrivilegedActionException {
        return AccessController.doPrivileged(new PrivilegedExceptionAction<FileOutputStream>() {
            public FileOutputStream run() throws Exception {
                File f = new File(filename);
                File dir = f.getParentFile();
                if(dir != null) {
                    if(! dir.exists()) {
                        if(! dir.mkdirs()) {
                            throw new IOException("Unable to create directory for: " + filename);
                        }
                    }
                }
                return new FileOutputStream(f);
            }
        });
    }

    public static boolean privExists(final String filename) {
        return AccessController.doPrivileged(new PrivilegedAction<Boolean>() {
            public Boolean run() {
                File f = new File(filename);
                return f.exists();
            }
        });
    }

    public static long privModificationTime (final String filename) {
        return AccessController.doPrivileged(new PrivilegedAction<Long>() {
            public Long run() {
                File f = new File(filename);
                return f.lastModified();
            }
        });
    }

    private static String[] privList(final String dirname) {
        return AccessController.doPrivileged(new PrivilegedAction<String[]>() {
            public String[] run() {
                File f = new File(dirname);
                return f.list();
            }
        });
    }

}
