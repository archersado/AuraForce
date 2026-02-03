// Redirect old path to new protected path
import { redirect } from 'next/navigation';

export default function WorkspaceNewPage() {
  redirect('/auraforce/workspace/new');
}
