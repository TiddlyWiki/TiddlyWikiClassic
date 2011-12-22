
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URL;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.security.PrivilegedActionException;
import java.security.PrivilegedExceptionAction;


/**
 * 
 * TiddlySaver Applet.
 *
 * If there is a method to communicate a meaningful java exception to javascript
 * I have not found it yet.
 *
 * If we want to retain compatiblity to the old javascript code we are constrained
 * by the old interface.  Old javascript code had to handle exceptions.
 *
 * It's ugly as hell but this is the current approach:
 *
 * * Signal an error by throwing an exception
 * * JavaScript may query the text / stacktrace of the last exception.
 * * As long as the browsers are not multithreading the javascript this should work
 *
 *
 */
public class TiddlySaver extends java.applet.Applet {

    /**
     * Resolve filenames relative to directory where the applet resides.
     *
     * Otherwise current directory of plugin process is used, which may be
     * anywhere.
     */
    private static final boolean filenamesRelativeToAppletDir = false;

    private String lastErrorMsg;
    private String lastErrorStackTrace;

    /**
     * Load a file and return the content.
     *
     * @param filename
     * @param charset
     * @return always 1, on error an exception is thrown.  Old code expects it this way
     */
    public String loadFile(final String filename, final String charset) {
        StringBuilder sb = new StringBuilder();
        try {
            FileInputStream in = privInputStream(filename);
            try {
                InputStreamReader reader =
                        isNullOrEmpty(charset)
                        ? new InputStreamReader(in)
                        : new InputStreamReader(in, charset);
                try {
                    final char[] buff = new char[4096];
                    for (;;) {
                        int len = reader.read(buff);
                        if (len < 0) {
                            break;
                        }
                        sb.append(buff, 0, len);
                    }
                } finally {
                    reader.close();
                }
            } finally {
                in.close();
            }
        } catch (Exception e) {
            logAndRethrow("loadFile", e);
        }
        return sb.toString();
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
    public int saveFile(final String filename, final String charset, final String data) {
        try {
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
        } catch (Exception e) {
            logAndRethrow("saveFile", e);
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
        boolean b = false;
        try {
            b = privExists(filename);
        } catch(Exception e) {
            logAndRethrow("exists", e);
        }
        return b;
    }

    /**
     *
     * Get a files modification time in milliseconds since the epoch.
     *
     * @param filename
     * @return
     */
    public long modificationTime(final String filename) {
        long millis = 0L;
        try {
            millis = privModificationTime(filename);
            if(millis == 0L) {
                throw new IOException("Unable to get file modification time: " + filename);
            }
        } catch(Exception e) {
            logAndRethrow("modificationTime", e);
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
    public String[] listFiles(final String dirname) {
        String[] filenames = null;
        try {
            filenames = privList(dirname);
            if(filenames == null) {
                throw new IOException("Not a directory:" + dirname);
            }
        } catch (Exception e) {
            logAndRethrow("listFiles", e);
        }
        return filenames;
    }


    public static boolean isNullOrEmpty(String s) {
        return s == null || "".equals(s.trim());
    }

    private FileInputStream privInputStream(final String filename) throws PrivilegedActionException {
        return AccessController.doPrivileged(new PrivilegedExceptionAction<FileInputStream>() {
            public FileInputStream run() throws Exception {
                return new FileInputStream(resolveFilename(filename));
            }
        });
    }

    private FileOutputStream privOutputStream(final String filename) throws PrivilegedActionException {
        return AccessController.doPrivileged(new PrivilegedExceptionAction<FileOutputStream>() {
            public FileOutputStream run() throws Exception {
                File f = resolveFilename(filename);
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

    private boolean privExists(final String filename) {
        return AccessController.doPrivileged(new PrivilegedAction<Boolean>() {
            public Boolean run() {
                File f = resolveFilename(filename);
                return f.exists();
            }
        });
    }

    private long privModificationTime (final String filename) {
        return AccessController.doPrivileged(new PrivilegedAction<Long>() {
            public Long run() {
                File f = resolveFilename(filename);
                return f.lastModified();
            }
        });
    }

    private String[] privList(final String dirname) {
        return AccessController.doPrivileged(new PrivilegedAction<String[]>() {
            public String[] run() {
                File f = resolveFilename(dirname);
                return f.list();
            }
        });
    }

    /**
     * Provide access to the last error message.
     *
     */
    public String getLastErrorMsg() {
        return lastErrorMsg;
    }


    /**
     * Get access to last stack trace
     * 
     * @return
     */
    public String getLastErrorStackTrace() {
        return lastErrorStackTrace;
    }
    
    @SuppressWarnings("empty-statement")
    private void logAndRethrow(String msg, Exception e) {
        Throwable rootCause;
        for(rootCause = e ; rootCause.getCause() != null; rootCause = rootCause.getCause()) ;
        lastErrorMsg = rootCause.toString();

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw, true);
        rootCause.printStackTrace(pw);
        lastErrorStackTrace = sw.toString();

        if(e instanceof RuntimeException) {
            throw (RuntimeException) e;
        } else {
            throw new RuntimeException(e);
        }
    }

    /**
     *
     * Resolve relative file names relative to the applet directory.
     *
     * While I am not sure this is correct behaviour, at least it is consistent.
     * (Before, relative filenames were resolved relative to the current directory
     * of the plugin process.  I.e. from wherever the browser was initially started.
     *
     * @param filename
     * @return
     */
    public File resolveFilename(String filename) {
        File f = new File(filename);
        if(! filenamesRelativeToAppletDir)
            return f;

        if(f.isAbsolute()) {
            return f;
        }

        URL dirUrl = getCodeBase();
        // dirUrl.getPath() has a trailing slash!
        return new File(dirUrl.getPath() + filename);
    }
}
