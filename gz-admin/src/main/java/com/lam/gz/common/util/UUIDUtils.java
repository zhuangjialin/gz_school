package com.lam.gz.common.util;

import java.util.UUID;

/**
 */
/**
 * @author liubo
 *
 */
public class UUIDUtils {
	
	public static final int BIT_NUM = 8;
	
    private static String[] chars = new String[] { "a", "b", "c", "d", "e", "f",
            "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
            "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
            "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
            "W", "X", "Y", "Z" };
    
    private UUIDUtils(){
		throw new IllegalStateException("Utility class");
	}

    public static String genShortUuid() {
        StringBuilder shortBuilder = new StringBuilder();
        String uuid = UUID.randomUUID().toString().replace("-", "");
        for (int i = 0; i < BIT_NUM; i++) {
            String str = uuid.substring(i * 4, i * 4 + 4);
            int x = Integer.parseInt(str, 16);
            shortBuilder.append(chars[x % 0x3E]);
        }
        return shortBuilder.toString();

    }

    public static String getUuid() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
