import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    return (
        <div className="flex flex-wrap gap-1 mt-4">
            {links.map((l, i) =>
                l.url ? (
                    <Link
                        key={i}
                        href={l.url}
                        preserveScroll
                        className={'px-3 py-1 rounded border text-sm ' + (l.active ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-gray-50')}
                        dangerouslySetInnerHTML={{ __html: l.label }}
                    />
                ) : (
                    <span key={i} className="px-3 py-1 rounded border text-sm text-gray-400 bg-white"
                        dangerouslySetInnerHTML={{ __html: l.label }} />
                ),
            )}
        </div>
    );
}