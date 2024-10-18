import router from "@/router";
import { useFlightStore } from "@/stores/flightStore";
import { toJpeg } from "html-to-image";
import JSZip from "jszip";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export const download = () => {
  const { getFlight } = storeToRefs(useFlightStore());

  // Helper function to ensure the image has loaded before proceeding
  const loadImage = (image: HTMLImageElement): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const downloadPageAsImage = async () => {
    if (!document.getElementsByName("mdcpage")[0]) {
      console.error("Could not find element 'mdcpage'");
      return;
    }

    const pageElement = document.getElementsByName("mdcpage")[0];
    try {
      const dataUrl = await toJpeg(pageElement, { pixelRatio: 1 });
      const image = new Image();
      image.src = dataUrl;

      // Ensure the image has loaded before attempting to convert it to a blob
      await loadImage(image);

      const imageBlob = await imageToBlob(image);

      const link = document.createElement("a");
      link.href = URL.createObjectURL(imageBlob);
      link.download = `${getFlight.value.callsign}_${
        router.currentRoute.value.name as string
      }.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to download page as image", error);
    }
  };

  const createZip = async () => {
    await new Promise((resolve) => setTimeout(() => resolve(true), 600));

    let images = new Array();

    const pagesDiv = document.getElementById("mdcpages");
    if (!pagesDiv) {
      console.error("Could not find element 'mdcpages'");
      return;
    }

    const childDivs = Array.from(pagesDiv.children)
      .filter((child) => child.tagName.toLowerCase() === "div")
      .slice(0, 4);
    if (!childDivs) {
      console.error("Could not find child elements of 'mdcpages'");
      return;
    }

    for (let i = 0; i < childDivs.length; i++) {
      await new Promise((resolve) => setTimeout(() => resolve(true), 100));
      const pageElement = childDivs[i];
      if (!pageElement) {
        console.error("Could not find element at index", i);
        continue;
      }

      try {
        const dataUrl = await toJpeg(pageElement as HTMLElement, {
          pixelRatio: 1,
        });
        if (!dataUrl) {
          console.error("Failed to create dataUrl for page", i);
          continue;
        }

        const image = new Image();
        image.src = dataUrl;
        try {
          images.push(await loadImage(image));
        } catch (error) {
          console.error("Failed to load image for page", i, error);
        }
      } catch (error) {
        console.error("Failed to create image for page", i, error);
      }
    }

    await downloadImagesAsZip(images)
      .catch((error) => {
        console.error("Failed to download images as zip", error);
      })
      .finally(() => {
        images = new Array();
      });
  };

  const imageToBlob = async (image: HTMLImageElement): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not create canvas context");
    }

    context.drawImage(image, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image to blob"));
        }
      }, "image/png");
    });
  };

  const downloadImagesAsZip = async (pageImages: HTMLImageElement[]) => {
    const zip = new JSZip();

    for (let i = 0; i < pageImages.length; i++) {
      const image = pageImages[i];
      const imageName = `P${i + 11}.png`;

      // Ensure the image is converted to a blob before adding it to the zip file
      const imageBlob = await imageToBlob(image);
      zip.file(imageName, imageBlob);
    }

    zip.generateAsync({ type: "blob" }).then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${getFlight.value.callsign}.zip`;
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);
    });
  };

  return {
    createZip,
    downloadPageAsImage,
  };
};
