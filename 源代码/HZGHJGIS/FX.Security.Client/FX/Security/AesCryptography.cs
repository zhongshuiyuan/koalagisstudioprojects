namespace FX.Security
{
    using System;
    using System.IO;
    using System.Security.Cryptography;
    using System.Text;

    public class AesCryptography
    {
        public static string Password = "Undefined";
        public static string Salt = "Undefined";

        public static byte[] Decrypt(string encryptedString)
        {
            return Decrypt(encryptedString, "", "");
        }

        public static byte[] Decrypt(string encryptedString, string password, string salt)
        {
            if (encryptedString == null)
            {
                throw new NullReferenceException("需要解密的文本为空。");
            }
            if (string.IsNullOrEmpty(password))
            {
                password = Password;
            }
            if (string.IsNullOrEmpty(salt))
            {
                salt = Salt;
            }
            Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(Password, Encoding.UTF8.GetBytes(salt));
            AesManaged managed = new AesManaged();
            managed.Key = bytes.GetBytes(managed.KeySize / 8);
            managed.IV = bytes.GetBytes(managed.BlockSize / 8);
            using (MemoryStream stream = new MemoryStream())
            {
                CryptoStream stream2 = new CryptoStream(stream, managed.CreateDecryptor(), CryptoStreamMode.Write);
                byte[] buffer = Convert.FromBase64String(encryptedString);
                stream2.Write(buffer, 0, buffer.Length);
                stream2.Close();
                return stream.ToArray();
            }
        }

        public static string Encrypt(byte[] bytes)
        {
            return Encrypt(bytes, "", "");
        }

        public static string Encrypt(byte[] bytes, string password, string salt)
        {
            if (bytes == null)
            {
                throw new NullReferenceException("需要加密的字节数组为空。");
            }
            if (string.IsNullOrEmpty(password))
            {
                password = Password;
            }
            if (string.IsNullOrEmpty(salt))
            {
                salt = Salt;
            }
            Rfc2898DeriveBytes bytes2 = new Rfc2898DeriveBytes(Password, Encoding.UTF8.GetBytes(salt));
            AesManaged managed = new AesManaged();
            managed.Key = bytes2.GetBytes(managed.KeySize / 8);
            managed.IV = bytes2.GetBytes(managed.BlockSize / 8);
            using (MemoryStream stream = new MemoryStream())
            {
                CryptoStream stream2 = new CryptoStream(stream, managed.CreateEncryptor(), CryptoStreamMode.Write);
                stream2.Write(bytes, 0, bytes.Length);
                stream2.Close();
                return Convert.ToBase64String(stream.ToArray());
            }
        }
    }
}

