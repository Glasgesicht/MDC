import router from "@/controller/router";
import { useFlightStore } from "@/controller/stores/flightStore";
import { usePackageStore } from "@/controller/stores/packageStore";
import { useGlobalStore } from "@/controller/stores/theatreStore";
import { toJpeg } from "html-to-image";
import JSZip from "jszip";
import { storeToRefs } from "pinia";

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

      triggerDownload(
        imageBlob,
        `p${router.currentRoute.value.name as string}_${
          getFlight.value.callsign
        }.png`
      );
    } catch (error) {
      console.error("Failed to download page as image", error);
    }
  };

  const createZip = async () => {
    // I just include this here to ensure the components are rendered (outside the users view) before processing
    await new Promise((resolve) => setTimeout(() => resolve(true), 10));

    const pagesDiv = document.getElementById("mdcpages");
    if (!pagesDiv) {
      console.error("Could not find element 'mdcpages'");
      return;
    }

    const childDivs = Array.from(pagesDiv.children)
      .filter((child) => child.tagName.toLowerCase() === "div")
      .slice(0, 5);

    if (!childDivs.length) {
      console.error("No valid child elements found in 'mdcpages'");
      return;
    }

    const imagePromises = childDivs.map(async (pageElement, index) => {
      try {
        const dataUrl = await toJpeg(pageElement as HTMLElement, {
          pixelRatio: 1,
        });
        const image = new Image();
        image.src = dataUrl;

        // Wait for the image to load before returning it
        return await loadImage(image);
      } catch (error) {
        console.error(`Failed to process page at index ${index}`, error);
        return null; // Handle individual failures without stopping the loop
      }
    });

    const processedImages = await Promise.all(imagePromises).then((images) =>
      images.filter((image) => image !== null)
    );

    if (processedImages.length === 0) {
      console.error("No valid images to download");
      return;
    }

    // Pass the valid images to download as a zip
    await downloadImagesAsZip(processedImages).catch((error) => {
      console.error("Failed to download images as zip", error);
    });
  };

  const imageToBlob = async (image: HTMLImageElement): Promise<Blob> => {
    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("Image dimensions are invalid");
    }

    // Use an offscreen canvas if available for better performance in supported browsers
    const canvas =
      "OffscreenCanvas" in window
        ? new OffscreenCanvas(image.naturalWidth, image.naturalHeight)
        : document.createElement("canvas");

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not create canvas context");
    }

    context.drawImage(image, 0, 0);

    // Use a synchronous method for OffscreenCanvas if possible
    if (canvas instanceof OffscreenCanvas) {
      return canvas.convertToBlob({ type: "image/png" });
    }

    // Fallback to the asynchronous method for regular canvas
    return new Promise((resolve, reject) => {
      (canvas as HTMLCanvasElement).toBlob((blob) => {
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

    // Convert all images to blobs concurrently
    const imagePromises = pageImages.map((image, index) =>
      imageToBlob(image).then((blob) => ({
        name: `P${index + 11}.png`,
        blob,
      }))
    );

    const imageFiles = await Promise.all(imagePromises);

    // Add files to zip
    for (const { name, blob } of imageFiles) {
      zip.file(name, blob);
    }

    // Generate zip blob asynchronously
    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "STORE",
      compressionOptions: { level: 0 },
    });

    // Trigger download
    triggerDownload(zipBlob, `${getFlight.value.callsign}.zip`);
  };

  /**
   * Utility function to trigger a download
   * @param {Blob} blob The blob to download
   * @param {string} filename The filename to use for the download
   */
  const triggerDownload = (blob: Blob, filename: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href); // Cleanup
  };

  /**
   * Downloads the current state of the application as a JSON file
   * @return {Promise<void>}
   */
  async function toJSON() {
    const globalStore = useGlobalStore();
    const { packages } = storeToRefs(usePackageStore());

    const jsonString = JSON.stringify(
      Object.assign({
        packages: packages.value,
        theatre: globalStore.theatre,
        missionStartTime: globalStore.time.missionStartTime, //@ts-ignore
        version: __APP_VERSION__,
      }),
      null,
      2
    );
    const blob = new Blob([jsonString], { type: "application/json" });

    triggerDownload(blob, globalStore.filename.split(".")[0] + ".json");
  }

  return {
    createZip,
    downloadPageAsImage,
    toJSON,
  };
};
