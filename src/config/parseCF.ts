import JSZip from "jszip";
import xml2js from "xml2js";

export function processCF(payload: any /* cf file is a zip */) {
  readCF(payload).then((res) => parseCfXML(res));

  function readCF(payload: any) {
    const zip = new JSZip();
    return new Promise<String>((resolve, reject) => {
      //resolve promise if we can load data from Mission.xml, otherwise reject
      zip
        .loadAsync(payload)
        .then((zip) => {
          return zip.forEach((relativePath, file) => {
            // console.log(relativePath);
            if (relativePath === "mission.xml")
              return file.async("text").then((filedata) => {
                resolve(filedata);
              });
          });
        })
        .catch((error) => reject(error));
    });
  }

  function parseCfXML(input: String) {
    console.log(input);
    const parser = new xml2js.Parser({
      explicitArray: true,
      ignoreAttrs: true,
    });

    parser.parseStringPromise(input).then((res) => {
      console.log(res);
      return;
    });
  }
}
