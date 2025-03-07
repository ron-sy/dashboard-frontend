import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    Intercom?: {
      (command: 'boot' | 'shutdown' | 'update' | 'reattach_activator', props?: any): void;
    };
    intercomSettings?: any;
  }
}

interface IntercomProviderProps {
  children: React.ReactNode;
}

const INTERCOM_APP_ID = 'ipkpxxhv';

export const IntercomProvider: React.FC<IntercomProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load Intercom script
    (function() {
      var w = window;
      var ic = w.Intercom;
      if (typeof ic === "function") {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
      } else {
        var d = document;
        var i = function() {
          (i as any).c(arguments);
        };
        (i as any).q = [];
        (i as any).c = function(args: any) {
          (i as any).q.push(args);
        };
        w.Intercom = i;
        var l = function() {
          var s = d.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
          var x = d.getElementsByTagName('script')[0];
          x.parentNode?.insertBefore(s, x);
        };
        l();
      }
    })();

    // Initialize Intercom
    if (currentUser && currentUser.metadata.creationTime) {
      window.Intercom?.('boot', {
        app_id: INTERCOM_APP_ID,
        user_id: currentUser.uid,
        name: currentUser.displayName || 'Unnamed User',
        email: currentUser.email || undefined,
        created_at: Math.floor(new Date(currentUser.metadata.creationTime).getTime() / 1000)
      });
    } else {
      window.Intercom?.('boot', {
        app_id: INTERCOM_APP_ID
      });
    }

    return () => {
      window.Intercom?.('shutdown');
    };
  }, [currentUser]);

  return <>{children}</>;
};

export default IntercomProvider; 