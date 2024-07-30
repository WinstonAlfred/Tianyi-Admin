'use client'

import { updateShip } from "@/lib/action/shipAction";
import { useFormState } from "react-dom";
import { SubmitButton } from "../buttons";
import type { Ship } from "@prisma/client";

const EditShipForm = ({ ship }: { ship: Ship }) => {
  const updateShipWithId = updateShip.bind(null, ship.id);
  const [state, formAction] = useFormState(updateShipWithId, null);

  return (
    <div>
      <form action={formAction}>
        <div className="mb-5">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-900"
          >
            Ship Name
          </label>
          <input
            type="text"
            name="id"
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Ship Name..."
            defaultValue={ship.id}
          />
          <div id="id-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.id}</p>
          </div>
        </div>

        <SubmitButton label="save" />
      </form>
    </div>
  );
};

export default EditShipForm;
