namespace FX.Serialization
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Runtime.Serialization;

    public class DataContractSerialization
    {
        public static object Deserialize<T>(byte[] bytes)
        {
            return Deserialize<T>(bytes, null);
        }

        public static object Deserialize<T>(byte[] bytes, IEnumerable<Type> knownTypes)
        {
            if (bytes == null)
            {
                throw new NullReferenceException("需要进行反序列化的字节数组为空。");
            }
            using (MemoryStream stream = new MemoryStream(bytes))
            {
                DataContractSerializer serialize = new DataContractSerializer(typeof(T), knownTypes);
                object obj = serialize.ReadObject(stream);
                return obj;
            }
        }

        public static object Deserialize(byte[] bytes, Type type)
        {
            return Deserialize(bytes, type, null);
        }

        public static object Deserialize(byte[] bytes, Type type, IEnumerable<Type> knownTypes)
        {
            if (bytes == null)
            {
                throw new NullReferenceException("需要进行反序列化的字节数组为空。");
            }
            if (type == null)
            {
                throw new NullReferenceException("反序列化得到的实例的类型为空。");
            }
            using (MemoryStream stream = new MemoryStream(bytes))
            {
                return new DataContractSerializer(type, knownTypes).ReadObject(stream);
            }
        }

        public static byte[] Serialize(object o)
        {
            return Serialize(o, null);
        }

        public static byte[] Serialize<T>(object o)
        {
            return Serialize<T>(o, null);
        }

        public static byte[] Serialize(object o, IEnumerable<Type> knownTypes)
        {
            if (o == null)
            {
                throw new NullReferenceException("需要进行序列化的实例为空。");
            }
            using (MemoryStream stream = new MemoryStream())
            {
                new DataContractSerializer(o.GetType(), knownTypes).WriteObject(stream, o);
                return stream.ToArray();
            }
        }

        public static byte[] Serialize<T>(object o, IEnumerable<Type> knownTypes)
        {
            if (o == null)
            {
                throw new NullReferenceException("需要进行序列化的实例为空。");
            }
            using (MemoryStream stream = new MemoryStream())
            {
                new DataContractSerializer(typeof(T), knownTypes).WriteObject(stream, o);
                return stream.ToArray();
            }
        }
    }
}

