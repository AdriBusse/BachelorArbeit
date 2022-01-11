// wait for apollo final state

import { waitFor } from "@testing-library/dom";

export const waitForResponse = async () => await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));