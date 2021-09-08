/*
ESTA PANTALLA SOLO SE UTILIZA EN PRUEBAS 
PARA VERIFICAR SI LA IMAGEN SI SE GUARDO CORRECTAMENTE
*/

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';

export function ImageScreenExample() {
  const [Imagen64, setImagen64] = useState();
  const [isLoading, setLoading] = useState(true);

  const GetImagen = async () => {
    try {
      const response = await fetch(
        'http://localhost:63745/api/vehiculos/GetImagen',
      );
      const json = await response.json();
      console.log(JSON.parse(json)[0]);
      const base64 = JSON.parse(json)[0];
      console.log(base64.contenido);
      const imagen = 'data:image/png;base64,' + base64.contenido;
      console.log(imagen);
      setImagen64(imagen);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetImagen();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Image
          style={styles.tinyLogo}
          source={{
            uri: Imagen64,
          }}
        />
        // <Text>
        //     {data.contenido}
        // </Text>
        //   <FlatList
        //     data={data}

        //     renderItem={({ item }) => (
        //       <Text>{item}</Text>
        //     )}
        //   />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 300,
    height: 300,
  },
});

export default ImageScreenExample;
