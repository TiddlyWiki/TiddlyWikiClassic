
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
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

    private static final boolean debug = false;

    private static final boolean restrictToSameDirectory = true;
    private static final boolean allowSystemProperties = false;

    private String lastErrorMsg;
    private String lastErrorStackTrace;
    private StringBuilder debugMsg = new StringBuilder();


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


    /**
     *
     * Get the Java version out to Javascript.
     *
     * @return
     */
    public String getJavaVersion () {
        return AccessController.doPrivileged(new PrivilegedAction<String>() {
            public String run() {
                return System.getProperty("java.version");
            }
        });
    }

    /**
     *
     * Get Java System properties out to javascript
     *
     * @return
     */
    public String getSystemProperties () {
        if(! allowSystemProperties) {
            return "";
        }
        return AccessController.doPrivileged(new PrivilegedAction<String>() {
            public String run() {
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw, false);
                System.getProperties().list(pw);
                pw.flush();
                return sw.toString();
            }
        });
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
        PrintWriter pw = new PrintWriter(sw, false);
        rootCause.printStackTrace(pw);
        pw.flush();
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
    public final File resolveFilename(String filename) {
        debugMsg.setLength(0);
        debug("Filename:", filename);
        filename = utf8DecodeHack(filename);
        debug("UTF8DecodeHack:", filename);

        try {
            File f = new File(filename);
            if(restrictToSameDirectory) {
                URL docURL = getDocumentBase();
                debug("docURL:", docURL);
                if(! "file".equals(docURL.getProtocol())) {
                    throw new RuntimeException("TiddlySaver did not come from file:///, refusing");
                }

                File canonicalFile = privCanonicalFile(f);
                // decode with no encoding is deprecated; following earlier code's hack
                // because of its warnings, but surely using "UTF-8" would be OK these days?
                String docPath = URLDecoder.decode(docURL.getPath(), "ISO-8859-1");
                debug("docPath:", docPath);
                docPath = utf8DecodeHack(docPath);
                debug("docPath decodeHack:", docPath);

                File canonicalDir = privCanonicalFile(new File(docPath));
                String canonicalURL = canonicalFile.toURI().toString();
                String canonicalDirURL = canonicalDir.toURI().toString();
                // don't want to use getParentFile() because of permission problems
                canonicalDirURL = canonicalDirURL.substring(0, canonicalDirURL.lastIndexOf('/')+1);

                debug("canonicalURL:", canonicalURL);
                debug("canonicalDirURL", canonicalDirURL);
                if(! canonicalURL.startsWith(canonicalDirURL)) {
                    throw new RuntimeException("File: " + canonicalURL + " is not in directory " + canonicalDirURL);
                }
            }

            return f;
        } catch(Exception e) {
            debug("resolveFilename:", e);
            if(e instanceof RuntimeException) {
                throw (RuntimeException) e;
            } else {
                throw new RuntimeException(e);
            }
        }
    }

    private File privCanonicalFile(final File f) throws PrivilegedActionException {
        return AccessController.doPrivileged(new PrivilegedExceptionAction<File> () {
            public File run() throws Exception {
                return f.getCanonicalFile();
            }
        });
    }

    private void debug(Object... args) {
        for(int i = 0, size = args.length; i < size; i++) {
            debugMsg.append(args[i].toString());
            if (i < size - 1) {
                debugMsg.append(" ");
            } else {
                debugMsg.append("\n");
            }
        }
    }

    public String getDebugMsg() {
        return debugMsg.toString();
    }

    /**
     * Try to UTF-8 decode a string.
     *
     * Ideally, we'd never get a string that contains UTF-8 characters.
     * This is not an ideal world.
     *
     * This may or may not work for systems that do not use UTF-8 for filenames.
     * Also on systems where we get filenames that are not f*cked up,
     * this will fail for filenames that look like UTF-8 encodings.
     *
     * @param s
     * @return
     */
    private static String utf8DecodeHack(String s) {
        try {
            byte[] b = s.getBytes("ISO-8859-1");
            String s2 = new String(b, "UTF-8");
            if (s2.indexOf("\uFFFD") != -1) {
                return s;
            } else {
                return s2;
            }
        } catch (UnsupportedEncodingException use) {
            System.out.println("Exception " + use);
            return s;
        }
    }

}
