import { useContactMaterial } from "@react-three/cannon";

// export const materialColors = {
//   bouncy: "yellow",
//   box: "#BB8E51",
//   ground: "#9b7653",
//   rubber: "darkgrey",
//   slippery: "royalblue",
// } as const;

export const bouncyMaterial = {
  name: "bouncy",
  /*
  Restitution for this material.
  If non-negative, it will be used instead of the restitution given by ContactMaterials.
  If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
  */
  restitution: 1.1,
};

export const boxMaterial = "box";

export const groundMaterial = "ground";

/*
Setting the friction on both materials prevents overriding the friction given by ContactMaterials.
Since we want rubber to not be slippery we do not set this here and instead use a ContactMaterial.
See https://github.com/pmndrs/cannon-es/blob/e9f1bccd8caa250cc6e6cdaf85389058e1c9238e/src/world/World.ts#L661-L673
*/
export const rubberMaterial = "rubber";

export const slipperyMaterial = {
  /*
  Friction for this material.
  If non-negative, it will be used instead of the friction given by ContactMaterials.
  If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
  */
  friction: 0,
  name: "slippery",
};

export const useContactMaterials = () => {
  useContactMaterial(groundMaterial, groundMaterial, {
    contactEquationRelaxation: 3,
    contactEquationStiffness: 1e8,
    friction: 0.4,
    frictionEquationStiffness: 1e8,
    restitution: 0.3,
  });

  useContactMaterial(boxMaterial, groundMaterial, {
    contactEquationRelaxation: 3,
    contactEquationStiffness: 1e8,
    // friction: 0.4,
    friction: 2e-2,
    frictionEquationStiffness: 1e8,
    restitution: 0,
  });
  useContactMaterial(boxMaterial, slipperyMaterial, {
    friction: 0,
    restitution: 0,
  });

  useContactMaterial(groundMaterial, slipperyMaterial, {
    friction: 0,
    restitution: 0.3,
  });
  useContactMaterial(slipperyMaterial, slipperyMaterial, {
    friction: 0.1,
    restitution: 0.3,
  });

  useContactMaterial(bouncyMaterial, slipperyMaterial, {
    friction: 0,
    restitution: 0.5,
  });
  useContactMaterial(bouncyMaterial, groundMaterial, {
    restitution: 0.9,
  });
  useContactMaterial(bouncyMaterial, bouncyMaterial, {
    restitution: 10.0, // This does nothing because bouncyMaterial already has a restitution
  });

  useContactMaterial(rubberMaterial, slipperyMaterial, {
    friction: 1,
    restitution: 0.3,
  });

  useContactMaterial(rubberMaterial, bouncyMaterial, {
    restitution: 0.5,
  });
};

export default useContactMaterials;
