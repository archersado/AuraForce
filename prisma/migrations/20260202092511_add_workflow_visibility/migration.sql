-- AlterTable
ALTER TABLE `workflow_specs`
  ADD COLUMN `visibility` VARCHAR(191) NOT NULL DEFAULT 'private';

-- CreateIndex
CREATE INDEX `workflow_specs_visibility_idx` ON `workflow_specs`(`visibility`);
